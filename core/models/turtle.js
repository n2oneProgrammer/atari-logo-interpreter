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

    copy(id) {
        return new Turtle(id, this.x, this.y, this.rotation);
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
