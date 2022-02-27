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
        InterfaceCanvas.refreshTurtles();
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
        InterfaceCanvas.refreshTurtles();
    }

    left(angle) {
        this.rotation -= parseInt(angle);
        InterfaceCanvas.refreshTurtles();
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
        InterfaceCanvas.refreshTurtles();
    }

    show() {
        console.log(this.id + " show");
        InterfaceCanvas.refreshTurtles();
    }

    setcolor(color) {
        this.color = color;
        InterfaceCanvas.refreshTurtles();
    }

    setpen(pen) {
        this.pen = pen;
    }

    serializable() {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            rotation: this.rotation,
            color: Color.getColor(this.color),
            pen: this.pen,
            isPenDown: this.isPenDown,
            visible: this.visible
        }
    }
};
