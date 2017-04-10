import path from 'path';
import { BrowserWindow, app } from 'electron';
import { enableLiveReload } from 'electron-compile';
import { isDebug } from './src/utils';

let mainWindow;

const createWindow = () => {
  enableLiveReload({ strategy: 'react-hmr' });

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720
  });

  mainWindow.loadURL(`file://${path.join(__dirname, '/renderer/index.html')}`);

  if (isDebug) {
    mainWindow.openDevTools();
  }

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
