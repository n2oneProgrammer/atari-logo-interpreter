const {
    app,
    BrowserWindow,
    ipcMain,
    dialog
} = require('electron');
const path = require('path');
const Runner = require("./core/runner.js");
const InterfaceCanvas = require("./core/utilities/interfaceCanvas.js");
const Interface = require("./core/utilities/interface.js");

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
    ipcMain.handle('save-procedures', (event, value) => {
        const { lastName, newName, params, body } = value;
        const obj = Interface.proceduresInEdit.find(p => p.name === lastName);
        const node = obj.node;
        const context = obj.context;
        Interface.setEditedMethod(lastName, newName, params, body, node, context);
    });
    ipcMain.handle('open-save-procedure-dialog', async (event) => {
        let options = {
            title: "Save LOGO procedures",
            defaultPath: "procedures.txt",
            buttonLabel: "Save procedures",
            filters: [
                {name: 'Text', extensions: ['txt']}
            ]
        };
        let result = await dialog.showSaveDialog(options);
        if (!result.canceled) {
            runner.start(`SAVE ${result.filePath}`);
        }
    });
    ipcMain.handle('open-load-procedure-dialog', async (event) => {
        let options = {
            title: "Load LOGO procedures",
            defaultPath: "procedures.txt",
            buttonLabel: "Load procedures",
            filters: [
                {name: 'Text', extensions: ['txt']}
            ]
        };
        let result = await dialog.showOpenDialog(options);
        console.log(result);
        if (!result.canceled) {
            runner.start(`LOAD ${result.filePaths[0]}`);
        }
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
