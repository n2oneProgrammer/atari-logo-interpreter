const {
    RuntimeError
} = require('./error');
const Token = require('./token');
const {
    FunctionValue
} = require('./values/function');
const NumberValue = require('./values/number');
const RuntimeResult = require('./utilities/runtimeResult');

module.exports = class Interpeter {
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
            new NumberValue(node.token.value).setPosition(node.pos_start, node.pos_end).setContext(context)
        );
    }

    visitVarNode(node, context) {
        let res = new RuntimeResult()
        let var_name = node.token.value;
        let value = context.symbolTable.get(var_name);
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

        value = value.copy().setPosition(node.pos_start, node.pos_end).setContext(context);
        return res.success(value);
    }

    visitBinaryOperationNode(node, context) {
        let res = new RuntimeResult();

        let left = res.register(this.visit(node.left, context));
        if (res.error) return res;
        let right = res.register(this.visit(node.right, context));
        if (res.error) return res;

        let obj = null

        if (node.operator.type === Token.PLUS) {
            obj = left.add(right);
        } else if (node.operator.type === Token.MINUS) {
            obj = left.subtract(right);
        } else if (node.operator.type === Token.MUL) {
            obj = left.multiply(right);
        } else if (node.operator.type === Token.DIV) {
            obj = left.divide(right);
        } else {
            return res.failure(new RuntimeError(
                node.pos_start,
                node.pos_end,
                `Invalid binary operator ${node.token.type}`,
                context
            ));
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
            } = right.multiply(new NumberValue(-1));
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

        return res.success(null)
    }
}
