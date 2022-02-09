class NumberNode {
    constructor(token) {
        this.token = token;

        this.pos_start = token.pos_start;
        this.pos_end = token.pos_end;
    }

    toString() {
        return `NumberNode(${this.token.value})`;
    }
}

class ListNode {
    constructor(nodes, pos_start, pos_end) {
        this.nodes = nodes;
        this.pos_start = pos_start;
        this.pos_end = pos_end;
    }

    toString() {
        const str = this.nodes.map(node =>
            node.toString()
        ).join(', ');

        return `ListNode(${str})`;
    }
}
class BinaryOperationNode {
    constructor(token, left, right) {
        this.token = token;
        this.left = left;
        this.right = right;

        this.pos_start = left.pos_start;
        this.pos_end = right.pos_end;
    }

    toString() {
        return `BinaryOperationNode(${this.left.toString()} ${this.token.type} ${this.right.toString()})`;
    }
}

class UnaryOperationNode {
    constructor(token, right) {
        this.token = token;
        this.right = right;

        this.pos_start = token.pos_start;
        this.pos_end = right.pos_end;
    }

    toString() {
        return `BinaryOperationNode(${this.right.toString()} ${this.token.value})`;
    }
}

class VarNode {
    constructor(token) {
        this.token = token;

        this.pos_start = token.pos_start;
        this.pos_end = token.pos_end;
    }

    toString() {
        return `VarNode(${this.token.value})`;
    }
}

class RepeatNode {
    constructor(numberNode, body) {
        this.numberNode = numberNode;
        this.body = body;

        this.pos_start = numberNode.pos_start;
        this.pos_end = body.pos_end;
    }

    toString() {
        return `RepeatNode(${this.numberNode.toString()}: ${this.body.toString()})`;
    }
}

class FunctionNode {
    constructor(name, args, body) {
        this.name = name;
        this.args = args;
        this.body = body;

        this.pos_start = name.pos_start;
        this.pos_end = body.pos_end;
    }

    toString() {
        const str = this.args.map(arg =>
            arg.value
        ).join(', ');

        return `FunctionNode(${this.name.value}[${str}]: ${this.body.toString()})`;
    }
}

class CallNode {
    constructor(node, args) {
        this.node = node;
        this.args = args;

        this.pos_start = node.pos_start;
        if (args.length > 0) {
            this.pos_end = args[args.length - 1].pos_end;
        } else {
            this.pos_end = node.pos_end;
        }
    }

    toString() {
        const str = this.args.map(arg =>
            arg.toString()
        ).join(', ');

        return `CallNode(${this.node.toString()}[${str}])`;
    }
}

class EdNode {
    constructor(tokens) {
        this.tokens = tokens;

        this.pos_start = tokens[0].pos_start;
        this.pos_end = tokens[tokens.length - 1].pos_end;
    }

    toString() {
        const str = this.tokens.map(token =>
            token.value
        ).join(', ');

        return `EdNode(${str})`;
    }
}

class TellNode {
    constructor(nodes) {
        this.nodes = nodes;

        this.pos_start = nodes[0].pos_start;
        this.pos_end = nodes[nodes.length - 1].pos_end;
    }

    toString() {
        const str = this.nodes.map(node =>
            node.toString()
        ).join(', ');

        return `TellNode(${str})`;
    }
}

class EachNode {
    constructor(body) {
        this.body = body;
        this.pos_start = body.pos_start;
        this.pos_end = body.pos_end;
    }

    toString() {
        return `EachNode(${this.body.toString()})`;
    }
}

class AskNode {
    constructor(nodes, body) {
        this.nodes = nodes;
        this.body = body;

        this.pos_start = nodes[0].pos_start;
        this.pos_end = body.pos_end;
    }
    toString() {
        const str = this.nodes.map(n =>
            n.value
        ).join(', ');

        return `AskNode([${str}]: ${this.body.toString()})`;
    }
}

class SaveLoadNode {
    constructor(token, path) {
        this.token = token;
        this.path = path;

        this.pos_start = token.pos_start;
        this.pos_end = path.pos_end;
    }
    toString() {
        return `${this.token.value}( ${this.path})`;
    }
}

module.exports = {
    NumberNode,
    ListNode,
    BinaryOperationNode,
    UnaryOperationNode,
    VarNode,
    RepeatNode,
    FunctionNode,
    CallNode,
    EdNode,
    TellNode,
    AskNode,
    SaveLoadNode,
    EachNode,
};
