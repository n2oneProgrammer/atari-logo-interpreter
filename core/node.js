export class NumberNode {
    constructor(token) {
        this.token = token;

        this.pos_start = token.pos_start;
        this.pos_end = token.pos_end;
    }
}

export class ListNode {
    constructor(nodes, pos_start, pos_end) {
        this.nodes = nodes
        this.pos_start = pos_start
        this.pos_end = pos_end
    }
}
export class BinaryOperationNode {
    constructor(token, left, right) {
        this.token = token;
        this.left = left;
        this.right = right;

        this.pos_start = left.pos_start;
        this.pos_end = right.pos_end;
    }
}

export class UnaryOperationNode {
    constructor(token, right) {
        this.token = token;
        this.right = right;

        this.pos_start = token.pos_start;
        this.pos_end = right.pos_end;
    }
}

export class VarNode {
    constructor(token, contextNode = null) {
        this.token = token;
        if (contextNode)
            if (contextNode.token === token) {
                contextNode = null
            }
        self.contextNode = contextNode

        this.pos_start = token.pos_start;
        this.pos_end = token.pos_end;
    }
}

export class RepeatNode {
    constructor(numberNode, body) {
        this.numberNode = numberNode;
        this.body = body;

        this.pos_start = numberNode.pos_start;
        this.pos_end = body.pos_end;
    }
}

export class FunctionNode {
    constructor(name, args, body) {
        this.name = name;
        this.args = args;
        this.body = body;

        this.pos_start = name.pos_start;
        this.pos_end = body.pos_end;
    }
}

export class CallNode {
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
}

export class EdNode {
    constructor(tokens) {
        this.tokens = tokens;

        this.pos_start = tokens[0].pos_start;
        this.pos_end = tokens[tokens.length - 1].pos_end;
    }
}

export class TellNode {
    constructor(nodes) {
        this.nodes = nodes;

        this.pos_start = nodes[0].pos_start;
        this.pos_end = nodes[nodes.length - 1].pos_end;
    }
}

export class AskNode {
    constructor(nodes, body) {
        this.nodes = nodes;
        this.body = body;

        this.pos_start = nodes[0].pos_start;
        this.pos_end = body[body.length - 1].pos_end;
    }
}

export class SaveLoadNode {
    constructor(token, path) {
        this.token = token;
        this.path = path;

        this.pos_start = token.pos_start;
        this.pos_end = path.pos_end;
    }
}
