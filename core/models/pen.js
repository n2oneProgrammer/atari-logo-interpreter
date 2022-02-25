module.exports = class Pen {
    constructor(id) {
        this.color = 0;
        this.id = id;
    }

    setColor(color) {
        this.color = color;
        console.log("Pen " + this.id + " set color to " + color);
    }
};
