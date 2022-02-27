const Turtle = require('./models/turtle');
const Pen = require('./models/pen');
const InterfaceCanvas = require("./utilities/interfaceCanvas.js");

module.exports = class InterpereterObjects {
    constructor() {
        this.turtles = [];
        this.pens = [];
        this.createPens();
        this.createTurtle(0, 0, 0, 0);
    }

    createPens() {
        for (let i = 0; i < 3; i++) {
            this.pens[i] = new Pen(i);
        }
    }

    createTurtle(id, x, y, rotation) {
        id = parseInt(id);
        this.turtles[this.turtles.length] = new Turtle(id, x, y, rotation);
        InterfaceCanvas.refreshTurtles();
        return this.turtles[this.turtles.length - 1];
    }

    isTurtle(id) {
        id = parseInt(id);
        return this.turtles.filter(turtle => turtle.id === id).length > 0;
    }

    getTurtle(id) {
        id = parseInt(id);
        return this.turtles.filter(turtle => turtle.id === id)[0];
    }

    getTurtles() {
        return this.turtles;
    }

    getPen(id) {
        id = parseInt(id);
        return this.pens[id]
    }

    addTurtle(id) {
        let newTurtle = this.createTurtle(parseInt(id), 0, 0, 0);
        this.turtles.push(newTurtle);
        return newTurtle;
    }
    removeAllTurtles(){
        this.turtles = [];
        this.createTurtle(0, 0, 0, 0);
    }
};
