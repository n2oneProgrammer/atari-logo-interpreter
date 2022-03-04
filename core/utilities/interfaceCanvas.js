module.exports = class InterfaceCanvas {
    static mainWindow = null;

    static createLine(x, y, x2, y2, width, color) {
        InterfaceCanvas.mainWindow.webContents.send("create-line", {x, y, x2, y2, width, color})
    }

    static editProcedure(name, agrNames, body, node, context) {
        InterfaceCanvas.mainWindow.webContents.send("edit-procedure", {name, agrNames, body, node, context})
    }

    static refreshCanvas() {
        InterfaceCanvas.mainWindow.webContents.send("refresh-canvas");
    }

    static refreshTurtles() {
        const Global = require("./global.js");
        let turtles = Global.getInterpreterObjects()?.getTurtles();
        if (turtles == null) {
            turtles = [];
        }
        InterfaceCanvas.mainWindow.webContents.send("refresh-turtles", turtles.map(obj => obj.serializable()))
    }

    static sendOutput(msg) {
        InterfaceCanvas.mainWindow.webContents.send("add-output", msg);
    }

    static clearCanvas() {
        InterfaceCanvas.mainWindow.webContents.send("clear-canvas")
    }

    static setWindow(mainWindow) {
        InterfaceCanvas.mainWindow = mainWindow;
    }
};
