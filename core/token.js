export default class Token {

    static DIGITS = "0123456789"
    static LETTERS = "abcdefghijklmnopqrstuvwxyz"
    static LETTERS_DIGITS = LETTERS + DIGITS + "_"
    static TYPE = {
        KEYWORD: "KEYWORD",
        IDENTIFIER: "IDENTIFIER",
        INTEGER: "INTEGER",
        COLON: "COLON",
        LSQUARE: "LSQUARE",
        RSQUARE: "RSQUARE",
        NEWLINE: "NEWLINE",
        PLUS: "PLUS",
        MINUS: "MINUS",
        MULTIPLY: "MULTIPLY",
        DIVDE: "DIVDE",
        LPAREN: "LPAREN",
        RPAREN: "RPAREN",
        EOF: "EOF"
    }
    static KEYWORDS = {
        REPEAT: "REPEAT",
        TO: "TO",
        END: "END",
        ED: "ED",
        TELL: "TELL",
        ASK: "ASK",
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
