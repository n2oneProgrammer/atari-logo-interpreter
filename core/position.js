module.exports = class Position {
    constructor(id, line, column, fn, ftext) {
        this.id = id;
        this.line = line;
        this.column = column;
        this.fn = fn;
        this.ftext = ftext;
    }

    advance(char = null) {
        this.id++;
        this.column++;
        if (char === "\n") {
            this.line++;
            this.column = 0;
        }
        return this;
    }

    copy() {
        return new Position(this.id, this.line, this.column, this.fn, this.ftext);
    }
}
