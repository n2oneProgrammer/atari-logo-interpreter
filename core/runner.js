const Lexer = require("./lexer.js");
const Parser = require("./parser.js");
const TokenPrinter = require("./tools/tokenPrinter.js");
const Context = require("./context.js");
const Interpreter = require("./interpreter.js");
const Global = require("./utilities/global.js");

module.exports = class Runner {
    constructor(fn, debug = false) {
        this.fn = fn;
        this.debug = debug;
        Global.initTable();
        Global.initInterpreterObjects();
    }

    start(text) {
        let lexer = new Lexer(this.fn, text);
        let result = lexer.run();
        if (result.error !== null) {
            return result.error.toString();
        }
        if (this.debug) console.log(TokenPrinter.toString(result.tokens));

        let parser = new Parser(result.tokens);
        result = parser.run();
        if (result.error !== null) {
            return result.error.toString();
        }
        if (this.debug) console.log(result.node.toString());

        let context = new Context("<global>");
        context.symbolTable = Global.getTable();
        let interpreter = new Interpreter(Global.getInterpreterObjects());
        result = interpreter.visit(result.node, context);
        if (result.error !== null) {
            return result.error.toString();
        }
        if (this.debug) console.log(context.symbolTable.toString());

        return result;
    }

    run(text, context) {
        let lexer = new Lexer(this.fn, text);
        let result = lexer.run();
        if (result.error !== null) {
            return result;
        }

        let parser = new Parser(result.tokens);
        result = parser.run();
        if (result.error !== null) {
            return result;
        }

        let interpreter = new Interpreter(Global.getInterpreterObjects());
        result = interpreter.visit(result.node, context);
        if (result.error !== null) {
            return result;
        }
        return result;
    }
};
