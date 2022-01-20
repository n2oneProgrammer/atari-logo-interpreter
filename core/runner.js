const Lexer = require("./lexer.js");
const Parser = require("./parser.js");
const TokenPrinter = require("./tools/tokenPrinter.js");


module.exports = class Runner {
    constructor(fn) {
        this.fn = fn;
    }

    start(text) {
        let lexer = new Lexer(this.fn, text);
        let result = lexer.run();
        if (result.error !== null) {
            return result.error.toString();
        }
        console.log(TokenPrinter.toString(result.tokens));
        let parser = new Parser(result.tokens);
        result = parser.run();
        if (result.error !== null) {
            return result.error.toString();
        }
        return result;
    }
}
