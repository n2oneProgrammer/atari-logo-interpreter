const {
    app,
    BrowserWindow,
    ipcMain
} = require('electron');
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

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    // eslint-disable-line global-require
    app.quit();
}


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
    const runner = new Runner("commandline");

    ipcMain.on('execute', (event, command) => {
        let res = runner.start(command);
        if (res.error !== null) {
            let errorMsg = res.error.toString();
            console.error(errorMsg);
            InterfaceCanvas.mainWindow.webContents.send("add-error", errorMsg);
        }
    });

    ipcMain.handle('get-turtles', (event) => {
        const Global = require("./core/utilities/global.js");
        const turtles = Global.getInterpreterObjects().getTurtles();
        return turtles.map(obj => obj.serializable());
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
