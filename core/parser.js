import {
    InvalidSyntaxError,
    ExceptedCharError
} from "./error";
import * as nodes from "./node";
import Token from "./token";

export default class Pareser {
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

    run() {
        //TODO: implement
    }
}

class ParserResult {
    constructor() {
        this.error = null
        this.node = null
        this.adv_count = 0
        this.to_reverse_count = 0
    }

    register(res) {
        this.adv_count += res.adv_count
        if (res.error) {
            this.error = res.error
        }
        return res.node
    }

    try_register(res) {
        if (res.error) {
            this.to_reverse_count = res.adv_count
            return null
        }
        return this.register(res)
    }

    register_advance() {
        this.adv_count += 1
    }

    success(node) {
        this.node = node
        return this
    }

    failure(error) {
        if (this.error !== null || this.adv_count === 0) {
            this.error = error
        }
        return this
    }
}
