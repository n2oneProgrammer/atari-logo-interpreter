export default class Token {

    static DIGITS = "0123456789"
    static LETTERS = "abcdefghijklmnopqrstuvwxyz"
    static LETTERS_DIGITS = Token.LETTERS + Token.DIGITS + "_"
    static TYPE = {
        KEYWORD: "KEYWORD",
        IDENTIFIER: "IDENTIFIER",
        NUMBER: "NUMBER",
        COLON: "COLON",
        LSQUARE: "LSQUARE",
        RSQUARE: "RSQUARE",
        PLUS: "PLUS",
        MINUS: "MINUS",
        MULTIPLY: "MULTIPLY",
        DIVDE: "DIVDE",
        LPAREN: "LPAREN",
        RPAREN: "RPAREN",
        EOF: "EOF"
    }
    static KEYWORDS = {
        REPEAT: "repeat",
        TO: "to",
        END: "end",
        ED: "ed",
        TELL: "tell",
        ASK: "ask",
    }

    constructor(type, value = null, pos_start = null, pos_end = null) {
        this.type = type;
        this.value = value;
        if (pos_start) {
            this.pos_start = pos_start.copy()
            this.pos_end = pos_start.copy()
            this.pos_end.advance()
        }
        if (pos_end) {
            this.pos_end = pos_end.copy()
        }
    }

    maches(type, value) {
        return this.type == type && this.value == value
    }

    isKeyword() {
        return this.type == Token.TYPE.KEYWORD
    }
}
