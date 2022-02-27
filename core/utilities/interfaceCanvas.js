module.exports = class InterfaceCanvas {
    static mainWindow = null;

    static createLine(x, y, x2, y2, width, color) {
        InterfaceCanvas.mainWindow.webContents.send("create-line", {x, y, x2, y2, width, color})
    }

    static refreshCanvas() {
        InterfaceCanvas.mainWindow.webContents.send("refresh-canvas")
    }

    static refreshTurtles() {
        const Global = require("./global.js");
        let turtles = Global.getInterpreterObjects()?.getTurtles();
        if (turtles == null) {
            turtles = [];
        }
        InterfaceCanvas.mainWindow.webContents.send("refresh-turtles", turtles.map(obj => obj.serializable()))
    }

    static clearCanvas() {
        InterfaceCanvas.mainWindow.webContents.send("clear-canvas")
    }

    static setWindow(mainWindow) {
        InterfaceCanvas.mainWindow = mainWindow;
    }
};
