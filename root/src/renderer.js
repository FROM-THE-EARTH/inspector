window.$ = window.jQuery = require('jquery');

const WirelessModule = require('./src/module/wireless-module');
const Setting = require('./src/module/setting');


class Renderer{
    constructor(){
        WirelessModule.initialize();
    }

    reloadSetting(){
        Setting.reload();
        WirelessModule.updateTransmitterHeader();
    }
};

const renderer = new Renderer();

$('#cui-clear-text-button').on('click', function(){
    renderer.reloadSetting();
});