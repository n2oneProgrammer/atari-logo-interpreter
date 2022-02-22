const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const Runner = require("./core/runner.js");
const InterfaceCanvas = require("./core/utilities/interfaceCanvas.js");

const env = process.env.NODE_ENV || 'production';

if (env === 'development') {
    require('electron-reload')(__dirname, {
        electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
        hardResetMethod: 'exit'
    });
}
const runner = new Runner("commandline");
const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    InterfaceCanvas.setWindow(mainWindow);
    ipcMain.on('execute', (event, command) => {
        let res = runner.run(command);
        if (res.error !== null)
            console.error(res.error.toString());
    });


    mainWindow.loadFile('static/pages/index.html');
};

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        app.quit();
});
