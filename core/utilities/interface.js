const {
    FunctionValue
} = require('../values/function');
const InterfaceCanvas = require("./interfaceCanvas.js");
const RuntimeResult = require("./runtimeResult.js");
const {
    RuntimeError
} = require("../error.js");
const Token = require("../token.js");
const {
    IllegalCharError
} = require("../error.js");
const Position = require("../position.js");

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
        this.proceduresInEdit.push({
            name,
            node,
            context
        });
        return new RuntimeResult().success(null) // TODO: this shoud return value from calling method Interface.setEditedMethod
    }

    static setEditedMethod(lastName, newName, agrNames, body, node, context) {

        newName = newName.toLowerCase();
        for (let i = 0; i < newName.length; i++) {
            if (Token.LETTERS_DIGITS.indexOf(newName[i]) === -1) {
                return new RuntimeResult().failure(
                    new IllegalCharError(new Position(i, 0, i, "edit in procedure name", newName), new Position(i, 0, i + 1, "edit", newName), `"${newName[i]}"`)
                );
            }
        }

        for (let i = 0; i < this.proceduresInEdit.length; i++) {
            agrNames[i] = agrNames[i].toLowerCase();
            for (let j = 0; j < agrNames[i].length; j++) {
                if (Token.LETTERS_DIGITS.indexOf(agrNames[i][j]) === -1) {
                    return new RuntimeResult().failure(
                        new IllegalCharError(new Position(j, 0, j, "edit in prarameter", agrNames[i]), new Position(j, 0, j + 1, "edit", agrNames[i]), `"${agrNames[i][j]}"`)
                    );
                }
            }
        }

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
