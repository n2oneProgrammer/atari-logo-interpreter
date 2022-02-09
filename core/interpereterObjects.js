const Turtle = require('./models/turtle');
const Pen = require('./models/pen');

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
        this.turtles[this.turtles.length] = new Turtle(id, x, y, rotation);
        return this.turtles[this.turtles.length - 1];
    }

    isTurtle(id) {
        return this.turtles.filter(turtle => turtle.id === id).length > 0;
    }

    getTurtle(id) {
        return this.turtles.filter(turtle => turtle.id === id)[0];
    }

    addTurtle(id, currentId) {
        this.turtles[this.turtles.length] = this.getTurtle(currentId).copy(id);
        return this.turtles[this.turtles.length - 1];
    }
}
