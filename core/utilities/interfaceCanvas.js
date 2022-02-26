module.exports = class InterfaceCanvas {
    static mainWindow = null;

    static createLine(x, y, x2, y2, width, color) {
        InterfaceCanvas.mainWindow.webContents.send("create-line", {x, y, x2, y2, width, color})
    }

    static refreshCanvas() {
        InterfaceCanvas.mainWindow.webContents.send("refresh-canvas")
    }

    static setWindow(mainWindow) {
        InterfaceCanvas.mainWindow = mainWindow;
    }
};
