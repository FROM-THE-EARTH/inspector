window.$ = window.jQuery = require('jquery');

const SerialPort = require('serialport');

const TeleProtocol = require('./telemetry-protocol');
const Setting = require('./setting');
const CUI = require('./cui');
const SystemStatus = require('./system-status');


class Module {
  constructor(name) {
    this.name = name;
    this.port = null;
    this.serialPort = null;
    this.selector_id = '#port-selector-' + name.toLowerCase();
    this.baudrate_id = '#port-baudrate-' + name.toLowerCase();
    this.error = false;
    this.connected = false;
  }
}


var transmitter = new Module('Transmitter');
var receiver = new Module('Receiver');
var useOneModule = false;
var latest_selected_module = null;

var uint8Decoder = new TextDecoder;
var receivedData = "";

function onReceiveData(res) {
  for (var i = 0; i < res.length; i++) {
    var c = uint8Decoder.decode(Uint8Array.of(res[i]))[0];
    receivedData += c;
    if (c == ';') {//end of data
      TeleProtocol.analyze(receivedData);
      receivedData = "";
    }
  }
}

function onTransmitCommand(e) {
  if (e.which == 13) {
    const text = $('#cui-input').val();
    if (text === '') {
      return;
    }
    if (transmitter.connected === false) {
      CUI.addText(CUI.TextType.Error, 'Transmitter is not connected');
      return;
    }
    transmitter.serialPort.write(Setting.transmitterHeader.value + text + '\r\n');
    CUI.addText(CUI.TextType.To, Setting.transmitterHeader.value + text);
    $('#cui-input').val("");
  }
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

function setOnSelectorChanged(module) {
  $(module.selector_id).on('change', function () {
    module.error = false;
    module.port = $(module.selector_id + ' option:selected').val();

    // disconnect
    if (module.port === 'Select Port') {
      if (useOneModule === true) {
        if (module === receiver) {
          receiver.serialPort.removeListener('data', onReceiveData);
        }
      } else {
        module.serialPort.close();
      }
      module.connected = false;
      useOneModule = false;
      CUI.addText(CUI.TextType.Info, module.name + '  disconnected');
      SystemStatus.changeStatus('status-' + module.name.toLowerCase(), SystemStatus.Type.Red);
      return;
    }

    // connected
    var baudrate = parseInt($(module.baudrate_id + ' option:selected').val());
    if (!Number.isInteger(baudrate)) {
      CUI.addText(CUI.TextType.Info, 'Select baudrate');
      module.port = 'Select Port';
      $(module.selector_id).val('Select Port');
      return;
    }
    if (transmitter.port === receiver.port) {
      module.serialPort = module === transmitter ? receiver.serialPort : transmitter.serialPort;
      useOneModule = true;
      CUI.addText(CUI.TextType.Info, 'Using same module for transmitter & receiver');
    } else {
      module.serialPort = new SerialPort(module.port, {
        baudRate: baudrate,
        parser: SerialPort.parsers.Readline,
      });

      latest_selected_module = module;
      module.serialPort.read(1);
    }

    // error check
    setTimeout(function () {
      if (module.error === true) {
        return;
      }

      // receiver
      if (module === receiver) {
        module.serialPort.addListener('data', onReceiveData);
      }

      module.connected = true;
      CUI.addText(CUI.TextType.Info, module.name + ' connected');
      SystemStatus.changeStatus('status-' + module.name.toLowerCase(), SystemStatus.Type.Green);
    }, 250);
  });
}


// if COM access denied
function onCOMAccessDenied(module) {
  if (latest_selected_module === module) {
    CUI.addText(CUI.TextType.Error, module.port + ' access denied');
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


var WirelessModule = {
  updatePorts() {
    updateSerialPorts(transmitter);
    updateSerialPorts(receiver);
  },

  updateTransmitterHeader() {
    $('#cui-input').off('keydown', onTransmitCommand);
    $('#cui-input').on('keydown', onTransmitCommand);
  },

  initialize() {
    this.updatePorts();

    setOnSelectorChanged(transmitter);
    setOnSelectorChanged(receiver);

    this.updateTransmitterHeader();
  }
};

module.exports = WirelessModule;