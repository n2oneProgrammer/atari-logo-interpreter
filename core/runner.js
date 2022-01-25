const Lexer = require("./lexer.js");
const Parser = require("./parser.js");
const TokenPrinter = require("./tools/tokenPrinter.js");
const Context = require("./context.js");
const Interpreter = require("./interpreter.js");
const globalSymbolTable = require("./utilities/globalSymbolTable.js");

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
        let context = new Context("<global>");
        context.symbolTable = globalSymbolTable();
        let interpreter = new Interpreter();
        result = interpreter.visit(result.node, context);
        if (result.error !== null) {
            return result.error.toString();
        }
        console.log(context.symbolTable);
        return result;
    }
}
