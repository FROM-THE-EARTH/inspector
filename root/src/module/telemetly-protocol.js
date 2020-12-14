window.$ = window.jQuery = require('jquery');

const cui = require('./cui');
const CUI = require('./cui');
const SystemStatus = require('./system-status');

class Sequence {
    constructor(text) {
        this.text = text;
    }
};

const Sequences = [
    new Sequence('Waiting'),
    new Sequence('Waiting Launch'),
    new Sequence('In Flight'),
    new Sequence('Landing')
];

function getDatas(res) {
    res = res.slice(0, -1);
    const datas = res.split(':')[1];
    return datas.split(',');
}

function formatVector(x, y, z) {
    x = parseFloat(x);
    y = parseFloat(y);
    z = parseFloat(z);
    return '(' + x.toFixed(2) + ',' + y.toFixed(2) + ',' + z.toFixed(2) + ')';
}

function analyzeFormatA(res) {
    const datas = getDatas(res);//time, accelXYZ, gyroXYZ
    $('#time-value').text(parseFloat(datas[0]).toFixed(2) + 's');
    $('#accel-value').text(formatVector(datas[1], datas[2], datas[3]) + 'G');
    $('#gyro-value').text(formatVector(datas[4], datas[5], datas[6]) + 'dps');
    const abs = Math.sqrt(datas[1] * datas[1] + datas[2] * datas[2] + datas[3] * datas[3]);
    $('#accel-abs-value').text(abs.toFixed(2) + 'G');
}

function analyzeFormatB(res) {
    const datas = getDatas(res);//time, temperature, pressure
    $('#time-value').text(parseFloat(datas[0]).toFixed(2) + 's');
    $('#temperature-value').text(parseFloat(datas[1]).toFixed(2) + 'C');
    $('#pressure-value').text(parseFloat(datas[2]).toFixed(2) + 'Pa');
}

function analyzeFormatC(res) {
    const datas = getDatas(res);//time, longitude, latitude
    $('#time-value').text(parseFloat(datas[0]).toFixed(2) + 's');
    $('#longitude-value').text(parseFloat(datas[1]).toFixed(6) + 'E');
    $('#latitude-value').text(parseFloat(datas[2]).toFixed(6) + 'N');
}

function analyzeFormatK(res) {
    const datas = getDatas(res);//time, accel-abs
    $('#time-value').text(parseFloat(datas[0]).toFixed(2) + 's');
    const abs = parseFloat(datas[1]).toFixed(2);
    $('#accel-abs-value').text(abs + 'G');
    CUI.addText(CUI.TextType.Event, 'Launch: ' + abs + 'G');
}

function analyzeFormatL(res) {
    const datas = getDatas(res);//time
    $('#time-value').text(parseFloat(datas[0]).toFixed(2) + 's');
    CUI.addText(CUI.TextType.Event, 'Open Parachute');
}

function analyzeFormatM(res) {
    const datas = getDatas(res);//time
    $('#time-value').text(parseFloat(datas[0]).toFixed(2) + 's');
    CUI.addText(CUI.TextType.Event, 'Detach');
}

function analyzeFormatZ(res) {
    const datas = getDatas(res);//message
    CUI.addText(CUI.TextType.Message, datas[0]);
}

module.exports = function (res) {
    setTimeout(function () {
        SystemStatus.changeStatus('status-telemetly', SystemStatus.Type.Red);
    }, 5000);

    if (res.length < 4
        || res[2] !== ':'
        || res[res.length - 1] !== ';') {
        return;
    }

    SystemStatus.changeStatus('status-telemetly', SystemStatus.Type.Green);
    clearTimeout();

    const header = res[0];
    const sequence = res[1];

    $.each(Sequences, function (index, value) {
        if (sequence == index) {
            $('#sequence-value').text(value.text);
            return false;
        }
        if (index === Sequences.length - 1) {
            $('#sequence-value').text('Unknown');
        }
    });


    switch (header) {
        case 'A':
            analyzeFormatA(res);
            break;
        case 'B':
            analyzeFormatB(res);
            break;
        case 'C':
            analyzeFormatC(res);
            break;
        case 'K':
            analyzeFormatK(res);
            break;
        case 'L':
            analyzeFormatL(res);
            break;
        case 'M':
            analyzeFormatM(res);
            break;
        case 'Z':
            analyzeFormatZ(res);
            break;
        default:
            CUI.addText(CUI.TextType.Info, 'Received unknown header');
            break;
    }
}