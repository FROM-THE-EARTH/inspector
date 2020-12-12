const { app, BrowserWindow, Menu, shell } = require('electron');

const Setting = require('./src/setting');
const setting = new Setting();

app.allowRendererProcessReuse = false;

let mainWindow = null;

const menu = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Open setting file',
        click() {
          setting.openSettingFile();
        }
      },
      {
        label: 'Reload setting',
        click() {
          setting.reload();
        }
      }
    ]
  },
  {
    label: 'Developper',
    submenu: [
      {
        label: 'Open DevTools',
        click() {
          mainWindow.webContents.openDevTools();
        }
      }
    ]
  },
  {
    label: 'Help',
    submenu: [
      {
        label: 'Open Website',
        click() {
          shell.openExternal('https://github.com/FROM-THE-EARTH/inspector');
        }
      }
    ]
  }
];

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    icon: 'file://' + __dirname + '/icon/icon.ico',
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  });

  mainWindow.setMenu(Menu.buildFromTemplate(menu));

  mainWindow.loadURL('file://' + __dirname + '/index.html');

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
});