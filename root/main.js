const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

app.allowRendererProcessReuse = false;

let mainWindow = null;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    icon: 'file://' + __dirname + '/icon/icon.ico',
    webPreferences: {
      nodeIntegration: true
    }
  });

  //mainWindow.setMenu(null);

  mainWindow.loadURL('file://' + __dirname + '/index.html');

  mainWindow.on('closed', function() {
    mainWindow = null;
  });

  mainWindow.webContents.openDevTools();
});