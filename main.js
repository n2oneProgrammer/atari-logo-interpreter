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
const fs = require('fs');

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
        },
        minHeight: 600,
        minWidth: 800,
        icon: './zulfik.png'
    });

    InterfaceCanvas.setWindow(mainWindow);
    const runner = new Runner("commandline");

    ipcMain.on('execute', (event, command) => {
        const res = runner.start(command);
        if (res.error !== null) {
            const errorMsg = res.error.toString();
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
        const res = Interface.setEditedMethod(lastName, newName, params, body, node, context);

        if (res.error !== null) {
            const errorMsg = res.error.toString();
            console.error(errorMsg);
            InterfaceCanvas.mainWindow.webContents.send("add-error", errorMsg);
            InterfaceCanvas.mainWindow.webContents.send("show-popup", {message: 'B????d przy edycji procedury'});
        } else {
            InterfaceCanvas.mainWindow.webContents.send("show-popup", {message: 'Zapisano zmiany'});
        }
    });
    ipcMain.handle('open-save-canvas-dialog', async (event, imgURL) => {
        let url = imgURL.split(";base64,").pop().toString();
        console.log(url);
        let options = {
            title: "Zapisz obraz p????tna",
            defaultPath: "obrazek.png",
            buttonLabel: "Zapisz obrazek",
            filters: [
                {name: 'Image', extensions: ['png']}
            ]
        };
        let result = await dialog.showSaveDialog(options);
        if (!result.canceled) {
            fs.writeFile(result.filePath.toString(), url, {encoding: "base64"}, err => {
                if (err) {
                    InterfaceCanvas.mainWindow.webContents.send("add-error", err);
                    return;
                }

                InterfaceCanvas.mainWindow.webContents.send("show-popup", {message: 'Zapisano obraz p????tna'});
            });
        } else {
            InterfaceCanvas.mainWindow.webContents.send("show-popup", {message: 'Anulowano'});
        }
    });
    ipcMain.handle('open-save-procedure-dialog', async (event) => {
        let options = {
            title: "Zapisz list?? procedur",
            defaultPath: "procedury.txt",
            buttonLabel: "Zapisz procedury",
            filters: [
                {name: 'Text', extensions: ['txt']}
            ]
        };
        let result = await dialog.showSaveDialog(options);
        if (!result.canceled) {
            runner.start(`SAVE ${result.filePath}`);
            InterfaceCanvas.mainWindow.webContents.send("show-popup", {message: 'Zapisano list?? procedur'});
        }
    });
    ipcMain.handle('open-load-procedure-dialog', async (event) => {
        let options = {
            title: "Wgraj list?? procedur",
            defaultPath: "procedury.txt",
            buttonLabel: "Wgraj procedury",
            filters: [
                {name: 'Text', extensions: ['txt']}
            ]
        };
        let result = await dialog.showOpenDialog(options);
        if (!result.canceled) {
            runner.start(`LOAD ${result.filePaths[0]}`);
            InterfaceCanvas.mainWindow.webContents.send("show-popup", {message: 'Wgrano list?? procedur'});
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
