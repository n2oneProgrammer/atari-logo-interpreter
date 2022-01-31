module.exports = class Turtle {
    constructor(id, x, y, rotation) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.rotation = rotation;
        this.color = 0;
        this.pen = 0;
        this.visible = true;
    }

    forward(distance) {}
    backward(distance) {}
    right(angle) {}
    left(angle) {}
    penup() {}
    pendown() {}
    pencolor(color) {}
    clear() {}
}
