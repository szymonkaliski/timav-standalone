import path from 'path';
import { app, BrowserWindow, Menu } from 'electron';
import { enableLiveReload } from 'electron-compile';
import { isDebug } from './src/utils';

let mainWindow;

const createWindow = () => {
  enableLiveReload({ strategy: 'react-hmr' });

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    titleBarStyle: 'hidden-inset'
  });

  const makeRouteToCallback = page => () => mainWindow.webContents.send('route', page);

  const menu = Menu.buildFromTemplate([
    {
      label: 'Timav',
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services', submenu: [] },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { label: 'Projects', accelerator: 'CmdOrCtrl+1', click: makeRouteToCallback('projects') },
        { label: 'Focus', accelerator: 'CmdOrCtrl+2', click: makeRouteToCallback('focus') },
        { label: 'Chains', accelerator: 'CmdOrCtrl+3', click: makeRouteToCallback('chains') },
        { label: 'Settings', accelerator: 'CmdOrCtrl+4', click: makeRouteToCallback('settings') },
        { type: 'separator' },
        { role: 'close' },
        { role: 'minimize' },
        { role: 'zoom' },
        { type: 'separator' },
        { role: 'front' }
      ]
    },
    {
      label: 'Help',
      role: 'help'
    }
  ]);

  Menu.setApplicationMenu(menu);

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
