const InterfaceCanvas = require("../utilities/interfaceCanvas.js");
module.exports = class Turtle {
    constructor(id, x, y, rotation) {

        const {interpreterObjects} = require("../utilities/globalSymbolTable.js");
        this.interpreterObjects = interpreterObjects();
        this.id = id;
        this.x = x;
        this.y = y;
        this.rotation = rotation;
        this.color = 0;
        this.pen = 0;
        this.visible = true;
    }

    copy(id) {
        return new Turtle(id, this.x, this.y, this.rotation);
    }

    forward(distance) {
        console.log(this.id + " forward " + distance);
        let newX = this.x + distance * Math.sin(this.rotation);
        let newY = this.x + distance * Math.cos(this.rotation);
        console.log(this.interpreterObjects.getPen);
        InterfaceCanvas.createLine(this.x, this.y, newX, newY, 20, this.interpreterObjects.getPen(this.pen));
        this.x = newX;
        this.y = newY;
    }

    backward(distance) {
        console.log(this.id + " backward " + distance);
    }

    right(angle) {
        console.log(this.id + " right " + angle);
    }

    left(angle) {
        console.log(this.id + " left " + angle);
    }

    penup() {
        console.log(this.id + "  up");
    }

    pendown() {
        console.log(this.id + "  down");
    }

    pencolor(color) {
        console.log(this.id + " pen color: " + color);
    }

    hide() {
        console.log(this.id + " hide");
    }

    show() {
        console.log(this.id + " show");
    }

    setcolor(color) {
        console.log(this.id + " setcolor " + color);
    }

    setpen(pen) {
        console.log(this.id + " setpen " + pen);
    }
};
