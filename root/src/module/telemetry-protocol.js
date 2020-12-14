window.$ = window.jQuery = require('jquery');

const CUI = require('./cui');
const SystemStatus = require('./system-status');
const Setting = require('./setting');
const Viewer = require('./viewer');


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

function parseDatas(recv) {
    recv = recv.slice(0, -1);
    const datas = recv.split(':')[1];
    return datas.split(',');
}

function formatVector(x, y, z) {
    x = parseFloat(x);
    y = parseFloat(y);
    z = parseFloat(z);
    return '(' + x.toFixed(2) + ',' + y.toFixed(2) + ',' + z.toFixed(2) + ')';
}

function analyzeFormatA(datas) {
    //time, accelXYZ, gyroXYZ
    $('#time-value').text(parseFloat(datas[0]).toFixed(2) + 's');
    $('#accel-value').text(formatVector(datas[1], datas[2], datas[3]) + 'G');
    $('#gyro-value').text(formatVector(datas[4], datas[5], datas[6]) + 'dps');
    const abs = Math.sqrt(datas[1] * datas[1] + datas[2] * datas[2] + datas[3] * datas[3]);
    $('#accel-abs-value').text(abs.toFixed(2) + 'G');

    //Viewer.rotateDeg();
}

function analyzeFormatB(datas) {
    //time, temperature, pressure
    $('#time-value').text(parseFloat(datas[0]).toFixed(2) + 's');
    $('#temperature-value').text(parseFloat(datas[1]).toFixed(2) + 'C');
    $('#pressure-value').text(parseFloat(datas[2]).toFixed(2) + 'Pa');
}

function analyzeFormatC(datas) {
    //time, longitude, latitude
    $('#time-value').text(parseFloat(datas[0]).toFixed(2) + 's');
    $('#longitude-value').text(parseFloat(datas[1]).toFixed(6) + 'E');
    $('#latitude-value').text(parseFloat(datas[2]).toFixed(6) + 'N');
}

function analyzeFormatK(datas) {
    //time, accel-abs
    $('#time-value').text(parseFloat(datas[0]).toFixed(2) + 's');
    const abs = parseFloat(datas[1]).toFixed(2);
    $('#accel-abs-value').text(abs + 'G');
    CUI.addText(CUI.TextType.Event, 'Launch: ' + abs + 'G');
}

function analyzeFormatL(datas) {
    //time
    $('#time-value').text(parseFloat(datas[0]).toFixed(2) + 's');
    CUI.addText(CUI.TextType.Event, 'Open Parachute');
}

function analyzeFormatM(datas) {
    //time
    $('#time-value').text(parseFloat(datas[0]).toFixed(2) + 's');
    CUI.addText(CUI.TextType.Event, 'Detach');
}

function analyzeFormatZ(datas) {
    //message
    CUI.addText(CUI.TextType.Message, datas[0]);
}

var Telemetry = {
    analyze(recv) {
        // is telemetry alive
        setTimeout(function () {
            SystemStatus.changeStatus('status-telemetry', SystemStatus.Type.Red);
        }, 5000);

        // ignore irregular data
        if (recv.length < 4
            || recv[2] !== ':'
            || recv[recv.length - 1] !== ';') {
            return;
        }

        clearTimeout();
        SystemStatus.changeStatus('status-telemetry', SystemStatus.Type.Green);

        recv = recv.slice(Setting.receiverHeaderSize);

        const header = recv[0];
        const sequence = recv[1];

        $.each(Sequences, function (index, value) {
            if (sequence == index) {
                $('#sequence-value').text(value.text);
                return false;
            }
            if (index === Sequences.length - 1) {
                $('#sequence-value').text('Unknown');
            }
        });

        const datas = parseDatas(recv);

        switch (header) {
            case 'A':
                analyzeFormatA(datas);
                break;
            case 'B':
                analyzeFormatB(datas);
                break;
            case 'C':
                analyzeFormatC(datas);
                break;
            case 'K':
                analyzeFormatK(datas);
                break;
            case 'L':
                analyzeFormatL(datas);
                break;
            case 'M':
                analyzeFormatM(datas);
                break;
            case 'Z':
                analyzeFormatZ(datas);
                break;
            default:
                CUI.addText(CUI.TextType.Info, 'Received unknown header');
                break;
        }
    }
}

module.exports = Telemetry;