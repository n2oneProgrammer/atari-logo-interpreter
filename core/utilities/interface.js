const {
    FunctionValue
} = require('../values/function');


module.exports = class Interface {

    static print(str) {

    }

    static getMethodToEdit(name, agrNames, body, node, context) {
        Interface.setEditedMethod(name, "xd", agrNames, body + " ht", node, context);
    }

    static setEditedMethod(lastName, newName, agrNames, body, node, context) {
        const Lexer = require("../lexer.js");
        const Parser = require("../parser.js");

        let lexer = new Lexer("Editor", body);
        let result = lexer.run();
        if (result.error !== null) {
            return result;
        }
        let parser = new Parser(result.tokens);
        result = parser.run();
        if (result.error !== null) {
            return result;
        }

        let func = new FunctionValue(newName, result.nodes, agrNames, `TO ${newName} ${agrNames.map(arg =>":"+arg).join(' ')} ${body} END`, body)
            .setPosition(node.pos_start, node.pos_end)
            .setContext(context);
        context.symbolTable.remove(lastName);
        context.symbolTable.set(newName, func);

        return result;
    }

}
