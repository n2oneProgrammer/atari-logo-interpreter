const {
    IllegalCharError,
    ExceptedCharError
} = require("./error.js");
const Position = require("./position.js");
const Token = require("./token.js");

module.exports = class Lexer {
    constructor(fn, text) {
        this.rules = fn;
        this.text = text.toLowerCase();
        this.pos = new Position(-1, 0, -1, fn, text);
        this.char = null;
        this.advance();
    }

    advance() {
        this.pos = this.pos.advance(this.char);
        this.char = this.pos.id < this.text.length ? this.text[this.pos.id] : null;
    }

    run() {
        let tokens = [];
        while (this.char !== null) {
            if (this.char === " " || this.char === "\n" || this.char === "\t") {
                this.advance();
            } else if (Token.DIGITS.indexOf(this.char) !== -1) {
                tokens.push(this.makeNumber());
            } else if (Token.LETTERS.indexOf(this.char) !== -1) {
                let t = this.makeIdentifier();
                if (Array.isArray(t)) {
                    tokens.push(...t);
                } else {
                    return {
                        tokens: [],
                        error: t,
                    };
                }
            } else if (this.char === "+") {
                tokens.push(new Token(Token.TYPE.PLUS, null, this.pos));
                this.advance();
            } else if (this.char === "-") {
                tokens.push(new Token(Token.TYPE.MINUS, null, this.pos));
                this.advance();
            } else if (this.char === "*") {
                tokens.push(new Token(Token.TYPE.MULTIPLY, null, this.pos));
                this.advance();
            } else if (this.char === "/") {
                tokens.push(new Token(Token.TYPE.DIVDE, null, this.pos));
                this.advance();
            } else if (this.char === "(") {
                tokens.push(new Token(Token.TYPE.LPAREN, null, this.pos));
                this.advance();
            } else if (this.char === ")") {
                tokens.push(new Token(Token.TYPE.RPAREN, null, this.pos));
                this.advance();
            } else if (this.char === "[") {
                tokens.push(new Token(Token.TYPE.LSQUARE, null, this.pos));
                this.advance();
            } else if (this.char === "]") {
                tokens.push(new Token(Token.TYPE.RSQUARE, null, this.pos));
                this.advance();
            } else if (this.char === ":") {
                tokens.push(new Token(Token.TYPE.COLON, null, this.pos));
                this.advance();
            } else if (this.char === "#") {
                this.makeComment();
            } else {
                let pos_start = this.pos.copy();
                let char = this.char;
                this.advance();
                return {
                    tokens: [],
                    error: new IllegalCharError(pos_start, this.pos, `"${char}"`),
                };
            }
        }
        tokens.push(new Token(Token.TYPE.EOF, null, this.pos));
        return {
            tokens: tokens,
            error: null,
        };
    }

    makeNumber() {
        let num_str = "";
        let pos_start = this.pos.copy();
        while (Token.DIGITS.indexOf(this.char) !== -1 && this.char !== null) {
            num_str += this.char;
            this.advance();
        }
        return new Token(Token.TYPE.NUMBER, num_str, pos_start, this.pos);
    }

    makeIdentifier() {
        let text = "";
        let pos_start = this.pos.copy();
        let result = [];
        while (
            Token.LETTERS_DIGITS.indexOf(this.char) !== -1 &&
            this.char !== null
        ) {
            text += this.char;
            this.advance();
        }
        if (Object.values(Token.KEYWORDS).includes(text)) {
            result.push(new Token(Token.TYPE.KEYWORD, text, pos_start, this.pos));
            if (text === Token.KEYWORDS.SAVE || text === Token.KEYWORDS.LOAD) {
                let t = this.makePath();
                if (t instanceof ExceptedCharError) {
                    return t;
                }
                result.push(t);
            }
        } else {
            result.push(new Token(Token.TYPE.IDENTIFIER, text, pos_start, this.pos));
        }
        return result;
    }

    makePath() {
        let text = "";
        while (this.char === " " || this.char === "\n" || this.char === "\t") {
            this.advance();
        }
        let pos_start = this.pos.copy();
        if (this.char === '"') {
            this.advance();
            while (this.char !== '"') {
                if (this.char === null) {
                    return new ExceptedCharError(this.pos, this.pos, '"');
                }
                text += this.char;
                this.advance();
            }
            this.advance();
        } else {
            while (
                this.char !== " " &&
                this.char !== "\n" &&
                this.char !== "\t" &&
                this.char !== null
            ) {
                text += this.char;
                this.advance();
            }
        }
        return new Token(Token.TYPE.PATH, text, pos_start, this.pos);
    }

    makeComment() {
        while (this.char !== null && this.char !== "\n") {
            this.advance();
        }
        this.advance();
    }
}
