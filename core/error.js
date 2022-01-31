class CustomError {
    constructor(pos_start, pos_end, error_name, desc) {
        this.pos_start = pos_start;
        this.pos_end = pos_end;
        this.error_name = error_name;
        this.desc = desc;
    }

    toString() {
        let r = `⚠  ${this.error_name}: ${this.desc}\n`;
        r += `   In ${this.pos_start.fn}, at line ${this.pos_start.line + 1}, char: ${this.pos_start.column + 1}\n`;
        r += this.stringWithArrows();
        return r;
    }

    stringWithArrows() {
        let result = "";

        let idx_start = Math.max(
            this.pos_start.ftext.lastIndexOf("\n", this.pos_start.id),
            0
        );
        let idx_end = this.pos_start.ftext.indexOf("\n", idx_start + 1);
        if (idx_end < 0) {
            idx_end = this.pos_start.ftext.length;
        }
        let line_count = this.pos_end.line - this.pos_start.line + 1;
        for (let i = 0; i < line_count; i++) {
            let line = this.pos_start.ftext.substr(idx_start, idx_end);
            let col_start = i == 0 ? this.pos_start.column : 0;
            let col_end = i == line_count - 1 ? this.pos_end.column : line.length - 1;

            result += "     " + line + "\n";
            result +=
                "     " + " ".repeat(col_start) + "^".repeat(col_end - col_start);

            idx_start = idx_end;
            idx_end = this.pos_start.ftext.indexOf("\n", idx_start + 1);
            if (idx_end < 0) {
                idx_end = this.pos_start.ftext.length;
            }
        }

        return result.replace("\t", "");
    }
}

class IllegalCharError extends CustomError {
    constructor(pos_start, pos_end, desc) {
        super(pos_start, pos_end, "Illegal Character", desc);
    }
}

class ExceptedCharError extends CustomError {
    constructor(pos_start, pos_end, desc) {
        super(pos_start, pos_end, "Excepted Character", desc);
    }
}

class InvalidSyntaxError extends CustomError {
    constructor(pos_start, pos_end, desc) {
        super(pos_start, pos_end, "Invalid Syntax", desc);
    }
}

class RuntimeError extends CustomError {
    constructor(pos_start, pos_end, desc, context) {
        super(pos_start, pos_end, "Runtime Error", desc);
        this.context = context;
    }

    toString() {

        let r = `⚠  ${this.error_name}: ${this.desc}`;
        r += this.generateCtx();
        r += this.stringWithArrows();
        return r;
    }

    generateCtx() {
        let r = "";
        let pos = this.pos_start;
        let ctx = this.context;

        let lastLine = ""
        let counter = 0;

        while (ctx != null) {
            let line = `In ${pos.fn} in ${ctx.displayName} at line ${pos.line + 1}, char: ${pos.column + 1}`
            if (lastLine == line) {
                counter++;
            } else {
                lastLine = line;

                if (counter > 0) {
                    r += ` (${counter} times)`
                }
                r += '\n'
                r += `   ${line}`;
                counter = 0;
            }
            pos = ctx.parentEntryPos;
            ctx = ctx.parent;
        }
        r += '\n'

        return r;
    }
}

module.exports = {
    IllegalCharError,
    ExceptedCharError,
    InvalidSyntaxError,
    RuntimeError
};
