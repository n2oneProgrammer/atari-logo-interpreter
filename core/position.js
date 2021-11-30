export default class Position {
    constructor(id, line, column, file, ftext) {
        this.id = id;
        this.line = line;
        this.column = column;
        this.file = file;
        this.ftext = ftext;
    }

    advance(ch = null) {
        this.id++
        this.column++
        if (ch === "\n") {
            this.line++
            this.column = 0
        }
        return this
    }

    copy() {
        return new Position(this.id, this.line, this.column, this.file, this.ftext)
    }
}
