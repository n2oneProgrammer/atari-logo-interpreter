const Turtle = require('./models/turtle');
const Pen = require('./models/pen');

module.exports = class InterpereterObjects {
    constructor() {
        this.turtles = [];
        this.pens = [];
        this.createPens();
        this.createTurtle(0, 0, 0);
    }

    createPens() {
        for (let i = 0; i < 3; i++) {
            this.pens[i] = new Pen(i);
        }
    }

    createTurtle(x, y, rotation) {
        this.turtles[this.turtles.length] = new Turtle(this.turtles.length, x, y, rotation);
        return this.turtles[this.turtles.length];
    }
}
