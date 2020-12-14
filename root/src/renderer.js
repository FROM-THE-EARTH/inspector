window.$ = window.jQuery = require('jquery');

const Telemetly = require('./src/module/wireless-module');
const Setting = require('./src/module/setting');


class Renderer{
    constructor(){
    }

    reloadSetting(){
        Setting.reload();
        Telemetly.updateTransmitterHeader();
    }
};

const renderer = new Renderer();

$('#cui-clear-text-button').on('click', function(){
    renderer.reloadSetting();
});