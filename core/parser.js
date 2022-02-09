const {
    InvalidSyntaxError,
    ExceptedCharError
} = require("./error.js");
const {
    NumberNode,
    ListNode,
    UnaryOperationNode,
    VarNode,
    RepeatNode,
    FunctionNode,
    CallNode,
    AskNode,
    TellNode,
    EdNode,
    EachNode,
    SaveLoadNode,
} = require("./node.js");
const Token = require("./token.js");
const {
    ParserAbstraction,
    ParserResult
} = require("./utilities/parser.js");

module.exports = class Pareser extends ParserAbstraction {
    statments() {
        let res = new ParserResult();
        let statments = [];
        let pos_start = this.current_token.pos_start.copy();

        let statment = res.register(this.statment());
        if (res.error !== null) return res;
        statments.push(statment);

        while (this.index + 1 < this.tokens.length) {
            res.register_advance();
            this.advance();
            if (
                this.current_token.type === Token.TYPE.EOF ||
                this.current_token.isKeyword(Token.KEYWORDS.END) ||
                this.current_token.type === Token.TYPE.RSQUARE
            )
                break;

            let statment = res.register(this.statment());
            if (res.error !== null) return res;

            statments.push(statment);
        }
        return res.success(
            new ListNode(statments, pos_start, this.current_token.pos_end.copy())
        );
    }

    statment() {
        let res = new ParserResult();

        if (this.current_token.isKeyword(Token.KEYWORDS.ED)) {
            res.register_advance();
            this.advance();
            let node = res.register(this.edExpr());
            if (res.error !== null) return res;
            return res.success(node);
        }

        if (this.current_token.isKeyword(Token.KEYWORDS.TELL)) {
            res.register_advance();
            this.advance();
            let node = res.register(this.tellExpr());
            if (res.error !== null) return res;
            return res.success(node);
        }

        if (this.current_token.isKeyword(Token.KEYWORDS.EACH)) {
            res.register_advance();
            this.advance();
            let node = res.register(this.eachExpr());
            if (res.error !== null) return res;
            return res.success(node);
        }

        if (this.current_token.isKeyword(Token.KEYWORDS.ASK)) {
            res.register_advance();
            this.advance();
            let node = res.register(this.askExpr());
            if (res.error !== null) return res;

            return res.success(node);
        }

        if (this.current_token.isKeyword(Token.KEYWORDS.REPEAT)) {
            res.register_advance();
            this.advance();
            let node = res.register(this.repeatExpr());
            if (res.error !== null) return res;

            return res.success(node);
        }

        if (this.current_token.isKeyword(Token.KEYWORDS.TO)) {
            res.register_advance();
            this.advance();
            let node = res.register(this.funcDef());

            if (res.error !== null) return res;
            return res.success(node);
        }

        if (
            this.current_token.isKeyword(Token.KEYWORDS.SAVE) ||
            this.current_token.isKeyword(Token.KEYWORDS.LOAD)
        ) {
            let node = res.register(this.saveLoadExpr());

            if (res.error !== null) return res;
            return res.success(node);
        }

        if (this.current_token.type === Token.TYPE.IDENTIFIER) {
            let t = this.current_token;
            res.register_advance();
            this.advance();

            let args = [];
            let expr = res.try_register(this.expression());
            if (expr === null) {
                this.reverse(res.to_reverse_count + 1);
            } else {
                while (expr !== null) {
                    args.push(expr);
                    expr = res.try_register(this.expression());
                }
                this.reverse(res.to_reverse_count + 1);
            }
            return res.success(new CallNode(new VarNode(t), args));
        }

        return res.failure(
            new InvalidSyntaxError(
                this.current_token.pos_start,
                this.current_token.pos_end,
                `Excepted ED, TELL, ASK, REPEAT, TO, SAVE, LOAD or identyfier`
            )
        );
    }

    expression() {
        return this.bin_op(this.term.bind(this), [
            Token.TYPE.PLUS,
            Token.TYPE.MINUS,
        ]);
    }

    term() {
        return this.bin_op(this.factor.bind(this), [
            Token.TYPE.DIVDE,
            Token.TYPE.MULTIPLY,
        ]);
    }

    factor() {
        let res = new ParserResult();
        let t = this.current_token;

        if (t.type === Token.TYPE.PLUS || t.type === Token.TYPE.MINUS) {
            res.register_advance();
            this.advance();
            let factor = res.register(this.factor());
            if (res.error !== null) return res;
            return res.success(new UnaryOperationNode(t, factor));
        }
        return this.atom();
    }

    atom() {
        let res = new ParserResult();
        let t = this.current_token;

        if (t.type === Token.TYPE.NUMBER) {
            res.register_advance();
            this.advance();
            return res.success(new NumberNode(t));
        }

        if (t.type === Token.TYPE.COLON) {
            res.register_advance();
            this.advance();
            t = this.current_token;
            if (t.type !== Token.TYPE.IDENTIFIER) {
                return res.failure(
                    new InvalidSyntaxError(
                        this.current_token.pos_start,
                        this.current_token.pos_end,
                        `Excepted Identifier after ':'`
                    )
                );
            }
            res.register_advance();
            this.advance();
            return res.success(new VarNode(t));
        }

        if (t.type === Token.TYPE.LPAREN) {
            res.register_advance();
            this.advance();
            let node = res.register(this.expression());
            if (res.error !== null) return res;
            if (this.current_token.type !== Token.TYPE.RPAREN) {
                return res.failure(
                    new ExceptedCharError(
                        this.current_token.pos_start,
                        this.current_token.pos_end,
                        `)`
                    )
                );
            }
            res.register_advance();
            this.advance();
            return res.success(node);
        }

        if (t.isKeyword(Token.KEYWORDS.WHO)) {
            res.register_advance();
            this.advance();
            return res.success(new VarNode(new Token(Token.TYPE.IDENTIFIER, "$who", t.pos_start, t.pos_end)));
        }

        return res.failure(
            new InvalidSyntaxError(
                this.current_token.pos_start,
                this.current_token.pos_end,
                `Excepted 'number', 'identifier', '(' or ':'`
            )
        );
    }

    edExpr() {
        let res = new ParserResult();
        let tokens = [];
        if (this.current_token.type === Token.TYPE.IDENTIFIER) {
            tokens.push(this.current_token);
        } else if (this.current_token.type === Token.TYPE.LSQUARE) {
            while (true) {
                res.register_advance();
                this.advance();

                if (this.current_token.type === Token.TYPE.RSQUARE) break;

                if (this.current_token.type === Token.TYPE.EOF) {
                    return res.failure(
                        new ExceptedCharError(
                            this.current_token.pos_start,
                            this.current_token.pos_end,
                            "]"
                        )
                    );
                }
                if (this.current_token.type !== Token.TYPE.IDENTIFIER) {
                    return res.failure(
                        new InvalidSyntaxError(
                            this.current_token.pos_start,
                            this.current_token.pos_end,
                            "Excepted Identifier"
                        )
                    );
                }
                tokens.push(this.current_token);
            }
        } else {
            return res.failure(
                new InvalidSyntaxError(
                    this.current_token.pos_start,
                    this.current_token.pos_end,
                    "Excepted Identifier or '['"
                )
            );
        }

        return res.success(new EdNode(tokens));
    }

    tellExpr() {
        let res = new ParserResult();

        if (this.current_token.type === Token.TYPE.LSQUARE) {
            let nodes = [];
            res.register_advance();
            this.advance();
            while (this.current_token.type !== Token.TYPE.RSQUARE) {
                if (this.current_token.type === Token.TYPE.EOF) {
                    return res.failure(
                        new ExceptedCharError(
                            this.current_token.pos_start,
                            this.current_token.pos_end,
                            "]"
                        )
                    );
                }

                let expr = res.register(this.expression());
                if (res.error !== null) {
                    return res;
                }

                nodes.push(expr);
            }
            return res.success(new TellNode(nodes));
        } else {
            let expr = res.register(this.expression());
            if (res.error !== null) return res;

            this.reverse(1);

            return res.success(new TellNode([expr]));
        }
    }

    askExpr() {
        let res = new ParserResult();
        if (this.current_token.type !== Token.TYPE.LSQUARE) {
            return res.failure(
                new ExceptedCharError(
                    this.current_token.pos_start,
                    this.current_token.pos_end,
                    "["
                )
            );
        }

        let nodes = [];
        while (this.current_token.type !== Token.TYPE.RSQUARE) {
            res.register_advance();
            this.advance();
            if (this.current_token.type === Token.TYPE.EOF) {
                return res.failure(
                    new ExceptedCharError(
                        this.current_token.pos_start,
                        this.current_token.pos_end,
                        "]"
                    )
                );
            }

            let expr = res.register(this.expression());
            if (res.error !== null) {
                return res;
            }
            nodes.push(expr);
        }
        res.register_advance();
        this.advance();

        if (this.current_token.type !== Token.TYPE.LSQUARE) {
            return res.failure(
                new ExceptedCharError(
                    this.current_token.pos_start,
                    this.current_token.pos_end,
                    "["
                )
            );
        }
        res.register_advance();
        this.advance();

        let body = res.register(this.statments());
        if (res.error !== null) return res;

        if (this.current_token.type !== Token.TYPE.RSQUARE) {
            return res.failure(
                new ExceptedCharError(
                    this.current_token.pos_start,
                    this.current_token.pos_end,
                    "]"
                )
            );
        }
        return res.success(new AskNode(nodes, body));
    }

    repeatExpr() {
        let res = new ParserResult();

        let numberNode = res.register(this.expression());
        if (res.error !== null) {
            return res;
        }

        if (this.current_token.type !== Token.TYPE.LSQUARE) {
            return res.failure(
                new ExceptedCharError(
                    this.current_token.pos_start,
                    this.current_token.pos_end,
                    "["
                )
            );
        }
        res.register_advance();
        this.advance();

        let body = res.register(this.statments());
        if (res.error !== null) return res;

        if (this.current_token.type !== Token.TYPE.RSQUARE) {
            return res.failure(
                new ExceptedCharError(
                    this.current_token.pos_start,
                    this.current_token.pos_end,
                    "]"
                )
            );
        }
        return res.success(new RepeatNode(numberNode, body));
    }

    funcDef() {
        let res = new ParserResult();

        if (this.current_token.type !== Token.TYPE.IDENTIFIER) {
            return res.failure(
                new InvalidSyntaxError(
                    this.current_token.pos_start,
                    this.current_token.pos_end,
                    "Excepted Identifier"
                )
            );
        }
        let name = this.current_token;

        res.register_advance();
        this.advance();

        let args = [];
        while (this.current_token.type === Token.TYPE.COLON) {
            res.register_advance();
            this.advance();
            if (this.current_token.type !== Token.TYPE.IDENTIFIER) {
                return res.failure(
                    new InvalidSyntaxError(
                        this.current_token.pos_start,
                        this.current_token.pos_end,
                        "Excepted Identifier"
                    )
                );
            }
            args.push(this.current_token);
            res.register_advance();
            this.advance();
        }

        let body = res.register(this.statments());
        if (res.error !== null) return res;

        if (!this.current_token.isKeyword(Token.KEYWORDS.END)) {
            return res.failure(
                new InvalidSyntaxError(
                    this.current_token.pos_start,
                    this.current_token.pos_end,
                    `Excepted ${Token.KEYWORDS.END}`
                )
            );
        }

        return res.success(new FunctionNode(name, args, body));
    }

    saveLoadExpr() {
        let res = new ParserResult();
        let t = this.current_token;

        res.register_advance();
        this.advance();

        if (this.current_token.type !== Token.TYPE.PATH) {
            return res.failure(
                new InvalidSyntaxError(
                    this.current_token.pos_start,
                    this.current_token.pos_end,
                    "Excepted Path"
                )
            );
        }

        return res.success(new SaveLoadNode(t, this.current_token));
    }

    eachExpr() {
        let res = new ParserResult();

        if (this.current_token.type !== Token.TYPE.LSQUARE) {
            return res.failure(
                new ExceptedCharError(
                    this.current_token.pos_start,
                    this.current_token.pos_end,
                    "["
                )
            );
        }
        res.register_advance();
        this.advance();

        let body = res.register(this.statments());
        if (res.error !== null) return res;

        if (this.current_token.type !== Token.TYPE.RSQUARE) {
            return res.failure(
                new ExceptedCharError(
                    this.current_token.pos_start,
                    this.current_token.pos_end,
                    "]"
                )
            );
        }

        return res.success(new EachNode(body));
    }
};
