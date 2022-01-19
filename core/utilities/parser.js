import Token from "../token.js";
import {
    InvalidSyntaxError
} from "../error.js";
import {
    BinaryOperationNode
} from "../node.js";

export class ParserAbstraction {
    constructor(tokens) {
        this.tokens = tokens;
        this.index = -1;
        this.advance();
    }

    advance() {
        this.index++;
        if (this.index >= 0 && this.index < this.tokens.length) {
            this.current_token = this.tokens[this.index];
        }
        return this.current_token;
    }

    reverse(count) {
        this.index -= count;
        if (this.index >= 0 && this.index < this.tokens.length) {
            this.current_token = this.tokens[this.index];
        }
        return this.current_token;
    }

    run() {
        let res = this.statments();
        if (res.error === null && this.current_token.type !== Token.TYPE.EOF)
            return res.failure(
                new InvalidSyntaxError(
                    this.current_token.pos_start,
                    this.current_token.pos_end,
                    "Excepted '+', '-', '*', '/'"
                )
            );
        return res;
    }

    bin_op(func, ops) {
        let res = new ParserResult();
        let left = res.register(func());
        if (res.error !== null) return res;

        while (ops.includes(this.current_token.type)) {
            let op_token = this.current_token;
            res.register_advance();
            this.advance();
            let right = res.register(func());
            if (res.error !== null) return res;
            left = new BinaryOperationNode(op_token, left, right);
        }
        return res.success(left);
    }
}

export class ParserResult {
    constructor() {
        this.error = null;
        this.node = null;
        this.adv_count = 0;
        this.to_reverse_count = 0;
    }

    register(res) {
        this.adv_count += res.adv_count;
        if (res.error !== null) {
            this.error = res.error;
        }
        return res.node;
    }

    try_register(res) {
        if (res.error !== null) {
            this.to_reverse_count = res.adv_count;
            return null;
        }
        return this.register(res);
    }

    register_advance() {
        this.adv_count += 1;
    }

    success(node) {
        this.node = node;
        return this;
    }

    failure(error) {
        if (this.error === null || this.adv_count === 0) {
            this.error = error;
        }
        return this;
    }
}
