const { app, BrowserWindow } = require('electron');

app.allowRendererProcessReuse = false;

let mainWindow = null;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    frame: false,
    width: 1280,
    height: 720,
    minWidth: 800,
    minHeight: 720,
    icon: 'file://' + __dirname + '/icon/icon.ico',
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  });

  mainWindow.setMenu(null);

  mainWindow.loadURL('file://' + __dirname + '/index.html');

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
});