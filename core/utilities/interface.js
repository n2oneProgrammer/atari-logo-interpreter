const {
    FunctionValue
} = require('../values/function');
const InterfaceCanvas = require("./interfaceCanvas.js");
const RuntimeResult = require("./runtimeResult.js");
const {
    RuntimeError
} = require("../error.js");

module.exports = class Interface {

    static proceduresInEdit = [];

    static print(str) {
        InterfaceCanvas.sendOutput(str);
    }

    static clear() {
        const Global = require("./global.js");
        Global.getInterpreterObjects().removeAllTurtles();
        InterfaceCanvas.clearCanvas();
    }

    static getMethodToEdit(name, agrNames, body, node, context) {
        InterfaceCanvas.editProcedure(name, agrNames, body); 
        this.proceduresInEdit.push({ name, node, context });
        return new new RuntimeResult().success(null) // TODO: this shoud return value from calling method Interface.setEditedMethod
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

        if (context.symbolTable.get(newName) != null) {
            if (context.symbolTable.get(newName).body_node == null) {
                return new RuntimeResult().failure(
                    new RuntimeError(
                        node.pos_start,
                        node.pos_end,
                        `Cannot edit built-in function`,
                        context
                    ));
            }
        }

        let func = new FunctionValue(newName, result.node, agrNames, `TO ${newName} ${agrNames.map(arg => ":" + arg).join(' ')} ${body} END`, body)
            .setPosition(node.pos_start, node.pos_end)
            .setContext(context);
        context.symbolTable.remove(lastName);
        context.symbolTable.set(newName, func);

        return result;
    }

};
