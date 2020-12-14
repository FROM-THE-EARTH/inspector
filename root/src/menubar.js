window.$ = window.jQuery = require('jquery');

const remote = require('electron').remote;

// Window operation icons
$('#menu-close-window').on('click', e => {
    remote.getCurrentWindow().close();
    e.target.blur();
});

$('#menu-max-window').on('click', e => {
    if (remote.getCurrentWindow().isMaximized()) {
        remote.getCurrentWindow().unmaximize();
    } else {
        remote.getCurrentWindow().maximize();
    }
    e.target.blur();
});

$('#menu-min-window').on('click', e => {
    remote.getCurrentWindow().minimize();
    e.target.blur();
});


// Menu buttons
$('.menu-button').on('click', e => {
    const cls = e.target.classList[1];

    $('.' + cls).each(function (index, value) {
        if (value.classList[0] === 'menu-inner-content') {
            closeAllMenu();
            $('#' + value.id).show();
        }
    });
});

function closeAllMenu() {
    $('.menu-inner-content').hide();
}

$('*').on('click', e => {
    var f = false;
    $.each(e.target.classList, function (index, value) {
        if (value === 'menu-button') {
            f = true;
            return;
        }
    });
    if (f === false) {
        closeAllMenu();
    }
});


// File
$('#menu-open-setting-file').on('click', e => {
    Setting.openSettingFile();
    closeAllMenu();
});

$('#menu-reload-setting').on('click', e => {
    Setting.reload();
    closeAllMenu();
});

//Developper
$('#menu-open-devtools').on('click', e => {
    remote.getCurrentWebContents().openDevTools();
    closeAllMenu();
});

// Help
$('#menu-open-website').on('click', e => {
    remote.shell.openExternal('https://github.com/FROM-THE-EARTH/inspector');
    closeAllMenu();
});