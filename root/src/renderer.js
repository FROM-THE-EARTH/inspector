window.$ = window.jQuery = require('jquery');

const WirelessModule = require('./src/module/wireless-module');
const Setting = require('./src/module/setting');
const Viewer = require('./src/module/viewer');


class Renderer{
    constructor(){
        WirelessModule.initialize();
    }

    reloadSetting(){
        Setting.reload();
        WirelessModule.updateTransmitterHeader();
        Viewer.rotateDeg(Setting.rocketInitialAngle.value);
    }
};

const renderer = new Renderer();

$('#reload-button').on('click', function () {
    renderer.reloadSetting();
  WirelessModule.updatePorts();
});