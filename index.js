import { enableLiveReload } from 'electron-compile';
import { BrowserWindow, app } from 'electron';
import path from 'path';

let mainWindow;

const createWindow = () => {
  enableLiveReload({ strategy: 'react-hmr' });

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720
  });

  mainWindow.loadURL(`file://${path.join(__dirname, '/renderer/index.html')}`);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

const start = () => {
  app.on('ready', createWindow);

  app.on('window-all-closed', () => {
    app.quit();
  });
};

start();
