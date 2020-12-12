window.$ = window.jQuery = require('jquery');

const { prototype } = require('serialport');
const SerialPort = require('serialport');

var AnalyzeTelemetly = require('./src/telemetly-protocol.js');

const CUI = require('./src/cui.js');
const cui = new CUI();

const SystemStatus = require('./src/system-status.js');
const sysstat = new SystemStatus();


class Module {
  constructor(name) {
    this.name = name;
    this.port = null;
    this.serialPort = null;
    this.selector_id = '#port-selector-' + name.toLowerCase();
    this.error = false;
  }
}

var transmitter = new Module('Transmitter');
var receiver = new Module('Receiver');
var useOneModule = false;
var latest_selected_module = null;


function onReceiveData(res) {
  cui.addText(cui.TextType.From, res);
  AnalyzeTelemetly(res);
  $('#cui-text-area').scrollTop($('#cui-text-area')[0].scrollHeight);
}

function updateSerialPorts(module) {
  $(module.selector_id).empty();

  $(module.selector_id).append('<option>Select Port</option>');

  SerialPort.list().then(ports => {
    ports.forEach(function (p) {
      $(module.selector_id).append('<option>' + p.path + '</option>');
      if (p.path === module.port) {
        $(module.selector_id).val(module.port);
      }
    });
  });
}

function onSelectorChanged(module) {
  $(module.selector_id).on('change', function () {
    module.error = false;
    module.port = $(module.selector_id + ' option:selected').val();

    // disconnect
    if (module.port === 'Select Port') {
      if(useOneModule === true){
        if(module === receiver){
          receiver.serialPort.removeListener('data', onReceiveData);
        }
      }else{
        module.serialPort.close();
      }
      useOneModule = false;
      cui.addText(cui.TextType.Info, module.name + '  disconnected');
      sysstat.changeStatus('status-' + module.name.toLowerCase(), sysstat.Type.Red);
      return;
    }

    // connected
    if(transmitter.port === receiver.port){
      module.serialPort = module === transmitter ? receiver.serialPort : transmitter.serialPort;
      useOneModule = true;
      cui.addText(cui.TextType.Info, 'Using same module for transmitter & receiver');
    }else{
      module.serialPort = new SerialPort(module.port, {
        baudRate: 9600,
        parser: SerialPort.parsers.Readline,
      });
      
      latest_selected_module = module;
      module.serialPort.read(1);
    }

    setTimeout(function () {
      if (module.error === true) {
        return;
      }

      cui.addText(cui.TextType.Info, module.name + ' connected');

      if (module === receiver) {
        module.serialPort.addListener('data', onReceiveData);
      }

      sysstat.changeStatus('status-' + module.name.toLowerCase(), sysstat.Type.Green);
    }, 250);
  });
}

$(function () {
  updateSerialPorts(transmitter);
  updateSerialPorts(receiver);

  onSelectorChanged(transmitter);
  onSelectorChanged(receiver);

  $('#port-update-button').on('click', function () {
    updateSerialPorts(transmitter);
    updateSerialPorts(receiver);
  });
});

// if COM access denied
function onCOMAccessDenied(module) {
  if (latest_selected_module === module) {
    cui.addText(cui.TextType.Error, module.port + ' access denied');
    latest_selected_module = null;
    module.error = true;
    module.port = 'Select Port';
    $(module.selector_id).val('Select Port');
  }
}
window.addEventListener("unhandledrejection", function (event) {
  onCOMAccessDenied(transmitter);
  onCOMAccessDenied(receiver);
});