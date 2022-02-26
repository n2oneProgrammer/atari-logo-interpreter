const InterfaceCanvas = require("../utilities/interfaceCanvas.js");
const Color = require("../utilities/colors.js");

module.exports = class Turtle {
    constructor(id, x, y, rotation) {
        this.Global = require("../utilities/global.js");
        this.id = id;
        this.x = x;
        this.y = y;
        this.rotation = rotation;
        this.color = 0;
        this.pen = 0;
        this.isPenDown = true;
        this.visible = true;
    }

    degree2rad(angle) {
        return angle / 180 * Math.PI;
    }


    copy(id) {
        return new Turtle(id, this.x, this.y, this.rotation);
    }

    forward(distance) {
        let interpreterObject = this.Global.getInterpreterObjects();
        let newX = this.x + distance * Math.cos(this.degree2rad(this.rotation - 90));
        let newY = this.y + distance * Math.sin(this.degree2rad(this.rotation - 90));
        if (this.isPenDown)
            InterfaceCanvas.createLine(this.x, this.y, newX, newY, 1, Color.getColor(interpreterObject.getPen(this.pen).color));

        this.x = newX;
        this.y = newY;
    }

    backward(distance) {
        let interpreterObject = this.Global.getInterpreterObjects();
        let newX = this.x - distance * Math.cos(this.degree2rad(this.rotation - 90));
        let newY = this.y - distance * Math.sin(this.degree2rad(this.rotation - 90));
        if (this.isPenDown)
            InterfaceCanvas.createLine(this.x, this.y, newX, newY, 1, Color.getColor(interpreterObject.getPen(this.pen).color));

        this.x = newX;
        this.y = newY;
    }

    right(angle) {
        this.rotation += parseInt(angle);
    }

    left(angle) {
        this.rotation -= parseInt(angle);
    }

    penup() {
        this.isPenDown = false;
    }

    pendown() {
        this.isPenDown = true;
    }

    pencolor(color) {
        console.log(color);
        this.pen = color;
    }

    hide() {
        console.log(this.id + " hide");
    }

    show() {
        console.log(this.id + " show");
    }

    setcolor(color) {
        this.color = color;
    }

    setpen(pen) {
        this.pen = pen;
    }
};
