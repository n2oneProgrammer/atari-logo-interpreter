const {
    RuntimeError
} = require("./error");
const Token = require("./token");
const {
    FunctionValue
} = require("./values/function");
const NumberValue = require("./values/number");
const RuntimeResult = require("./utilities/runtimeResult");
const fs = require("fs");
const Interface = require("./utilities/interface");

module.exports = class Interpeter {
    constructor(objcts) {
        this.objcts = objcts;
    }

    visit(node, context) {
        let func = this[`visit${node.constructor.name}`];
        if (func) {
            return func.call(this, node, context);
        } else {
            this.noVisitMethod(node, context);
        }
    }

    noVisitMethod(node, context) {
        throw new Error(`No visit method for ${node.constructor.name}`);
    }

    visitNumberNode(node, context) {
        return new RuntimeResult().success(
            new NumberValue(node.token.value)
            .setPosition(node.pos_start, node.pos_end)
            .setContext(context)
        );
    }

    visitVarNode(node, context) {
        let res = new RuntimeResult();
        let var_name = node.token.value;
        let value = null;
        try {
            value = context.symbolTable.get(var_name);
        } catch (error) {
            return res.failure(
                new RuntimeError(
                    node.pos_start,
                    node.pos_end,
                    `Call stack overflow`,
                    context
                )
            );
        }
        if (value == null) {
            return res.failure(
                new RuntimeError(
                    node.pos_start,
                    node.pos_end,
                    `Undefined variable '${var_name}'`,
                    context
                )
            );
        }

        value = value
            .copy()
            .setPosition(node.pos_start, node.pos_end)
            .setContext(context);
        return res.success(value);
    }

    visitBinaryOperationNode(node, context) {
        let res = new RuntimeResult();

        let left = res.register(this.visit(node.left, context));
        if (res.error) return res;
        let right = res.register(this.visit(node.right, context));
        if (res.error) return res;

        let obj = null;

        if (node.token.type === Token.TYPE.PLUS) {
            obj = left.add(right);
        } else if (node.token.type === Token.TYPE.MINUS) {
            obj = left.sub(right);
        } else if (node.token.type === Token.TYPE.MULTIPLY) {
            obj = left.mul(right);
        } else if (node.token.type === Token.TYPE.DIVDE) {
            obj = left.div(right);
        } else {
            return res.failure(
                new RuntimeError(
                    node.pos_start,
                    node.pos_end,
                    `Invalid binary operator ${node.token.type}`,
                    context
                )
            );
        }

        if (obj.error) {
            return res.failure(obj.error);
        } else {
            return res.success(obj.value.setPosition(node.pos_start, node.pos_end));
        }
    }

    visitUnaryOperationNode(node, context) {
        let res = new RuntimeResult();
        let right = res.register(this.visit(node.right, context));
        if (res.error) return res;

        if (node.token.type === Token.TYPE.MINUS) {
            let {
                value,
                error
            } = right.mul(new NumberValue(-1));
            if (error) return res.failure(error);
            return res.success(value.setPosition(node.pos_start, node.pos_end));
        } else {
            return res.success(right.setPosition(node.pos_start, node.pos_end));
        }
    }

    visitListNode(node, context) {
        let res = new RuntimeResult();

        for (let i = 0; i < node.nodes.length; i++) {
            const element = node.nodes[i];
            res.register(this.visit(element, context));
            if (res.error) return res;
        }

        return res.success(null);
    }

    visitRepeatNode(node, context) {
        let res = new RuntimeResult();

        let times = res.register(this.visit(node.numberNode, context));
        if (res.error) return res;

        for (let i = 0; i < times.value; i++) {
            context.symbolTable.set("i", new NumberValue(i));

            res.register(this.visit(node.body, context));
            if (res.error) return res;
        }

        return res.success(null);
    }

    visitFunctionNode(node, context) {
        let res = new RuntimeResult();

        let name = node.name.value;
        let body = node.body;
        let agrs_names = node.args.map((arg) => arg.value);

        let func = new FunctionValue(name, body, agrs_names, node.getContent(), node.getBody())
            .setPosition(node.pos_start, node.pos_end)
            .setContext(context);
        context.symbolTable.set(name, func);

        return res.success(null);
    }

    visitCallNode(node, context) {
        let res = new RuntimeResult();

        let args = [];
        let func = res.register(this.visit(node.node, context));
        if (res.error) return res;
        func = func.copy().setPosition(node.pos_start, node.pos_end).setObjcts(this.objcts);

        for (let i = 0; i < node.args.length; i++) {
            let value = res.register(this.visit(node.args[i], context));
            args.push(value);
            if (res.error) return res;
        }
        res.register(func.execute(args));
        if (res.error) return res;

        return res.success(null);
    }

    visitEdNode(node, context) {
        let res = new RuntimeResult();
        for (let i = 0; i < node.nodes.length; i++) {
            let func = res.register(this.visit(node.nodes[i], context));
            if (res.error) return res;
            if (func.body_node == null) {
                return res.failure(
                    new RuntimeError(
                        node.pos_start,
                        node.pos_end,
                        `Cannot edit built-in function`,
                        context
                    ));
            }
            Interface.getMethodToEdit(func.name, func.argNames, func.strBody, node, context)
        }
        return res.success(null);

    }

    visitTellNode(node, context) {
        let res = new RuntimeResult();
        let turtles = [];
        for (let i = 0; i < node.nodes.length; i++) {
            let value = res.register(this.visit(node.nodes[i], context));
            if (res.error) return res;

            if (!this.objcts.isTurtle(value.value)) {
                this.objcts.addTurtle(value.value);
            }
            turtles.push(value.value);
        }

        context.symbolTable.setWho(turtles);

        return res.success(null);
    }

    visitEachNode(node, context) {
        let res = new RuntimeResult();
        const ids = context.symbolTable.get("$who").data;
        for (let i = 0; i < ids.length; i++) {
            context.symbolTable.setWho(ids[i]);
            res.register(this.visit(node.body, context));
            if (res.error) return res;
        }
        context.symbolTable.setWho(ids);
        return res.success(null);
    }

    visitAskNode(node, context) {
        let res = new RuntimeResult();
        const prevIds = context.symbolTable.get("$who").data;

        for (let i = 0; i < node.nodes.length; i++) {
            let value = res.register(this.visit(node.nodes[i], context));
            if (res.error) return res;

            if (!this.objcts.isTurtle(value.value)) {
                this.objcts.addTurtle(value.value);
            }

            context.symbolTable.setWho(value.value);
            res.register(this.visit(node.body, context));
            if (res.error) return res;
        }
        context.symbolTable.setWho(prevIds);
        return res.success(null);
    }

    visitSaveLoadNode(node, context) {
        let res = new RuntimeResult();
        if (node.token.isKeyword(Token.KEYWORDS.SAVE)) {
            let txt = "";
            const funcs = context.symbolTable.getAllGlobalFunc();
            for (let i = 0; i < funcs.length; i++) {
                if (funcs[i].text !== undefined) {
                    txt += funcs[i].text + "\n\n";
                }
            }
            try {
                fs.writeFileSync(node.path.value, txt);
            } catch (e) {
                return res.failure(
                    new RuntimeError(
                        node.pos_start,
                        node.pos_end,
                        `File ${node.path.value} not found! \n     ${e}`,
                        context
                    )
                );
            }
            return res.success(null);
        } else if (node.token.isKeyword(Token.KEYWORDS.LOAD)) {
            let txt;
            try {
                txt = fs.readFileSync(node.path.value, "utf-8");
            } catch (e) {
                return res.failure(
                    new RuntimeError(
                        node.pos_start,
                        node.pos_end,
                        `File ${node.path.value} not found! \n     ${e}`,
                        context
                    )
                );
            }
            const Runner = require("./runner");
            let r = new Runner(node.path.value).run(txt, context);
            if (r.error) return r;
            return res.success(null);
        }
        return res.failure(
            new RuntimeError(
                node.pos_start,
                node.pos_end,
                "Not implemented yet",
                context
            )
        );
    }
};
