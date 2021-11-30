import Lexer from "./lexer.js";

export default class Run {
    constructor(fn) {
        this.fn = fn;
    }

    start(text) {
        let lexer = new Lexer(this.fn, text);
        let result = lexer.run();
        if (result.error !== null) {
            return result.error;
        }
        return result.tokens;
    }
}
