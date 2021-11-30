class CustomError {
    constructor(pos_start, pos_end, error_name, desc) {
        this.pos_start = pos_start;
        this.pos_end = pos_end;
        this.error_name = error_name;
        this.desc = desc;
    }

    toString() {
        let r = `${this.error_name}: ${this.desc}\n`
        r += `In ${this.pos_start.fn}, at line ${this.pos_start.line + 1}, char: ${this.pos_start.column + 1}`
        return r;
    }
}

export class IllegalCharError extends CustomError {
    constructor(pos_start, pos_end, desc) {
        super(pos_start, pos_end, 'Illegal Character', desc);
    }
}
