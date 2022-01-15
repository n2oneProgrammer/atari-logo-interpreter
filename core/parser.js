import {
    InvalidSyntaxError,
    ExceptedCharError
} from "./error.js";
import {
    NumberNode,
    ListNode,
    BinaryOperationNode,
    UnaryOperationNode,
    VarNode,
    RepeatNode,
    FunctionNode,
    CallNode,
    AskNode,
    TellNode,
    EdNode,
    SaveLoadNode

} from "./node.js";
import Token from "./token.js";
import {
    ParserAbstraction,
    ParserResult
} from "./utilities/parser.js";

export default class Pareser extends ParserAbstraction {

    statments() {
        let res = new ParserResult()
        let statments = []
        let pos_start = this.current_token.pos_start.copy()

        let statment = this.statment()
        if (statment == null) {
            return res.failure(
                new InvalidSyntaxError(
                    this.current_token.pos_start,
                    this.current_token.pos_end,
                    `Excepted 'statment'`
                )
            )
        }
        statment = res.register(statment)
        if (res.error !== null)
            return res
        statments.push(statment)

        while (this.index + 1 < this.tokens.length) {
            res.register_advance()
            this.advance()
            if (this.current_token.type === Token.TYPE.EOF || this.current_token.isKeyword(Token.KEYWORDS.END) || this.current_token.type === Token.TYPE.RSQUARE) {
                break
            }
            let statment = res.register(this.statment())
            statments.push(statment)
        }
        return res.success(
            new ListNode(statments, pos_start, this.current_token.pos_end.copy())
        )
    }

    statment() {
        let res = new ParserResult()

        if (this.current_token.isKeyword(Token.KEYWORDS.ED)) {
            res.register_advance()
            this.advance()
            let node = res.register(this.edExpr())
            if (res.error !== null)
                return res
            return res.success(node)
        }


        if (this.current_token.isKeyword(Token.KEYWORDS.TELL)) {
            res.register_advance()
            this.advance()
            let node = res.register(this.tellExpr())
            if (res.error !== null)
                return res
            return res.success(node)
        }

        if (this.current_token.isKeyword(Token.KEYWORDS.ASK)) {
            res.register_advance()
            this.advance()
            let node = res.register(this.askExpr())
            if (res.error !== null)
                return res

            return res.success(node)
        }

        if (this.current_token.isKeyword(Token.KEYWORDS.REPEAT)) {
            res.register_advance()
            this.advance()
            let a = this.repeatExpr()
            let node = res.register(a)
            if (res.error !== null)
                return res

            return res.success(node)
        }

        if (this.current_token.isKeyword(Token.KEYWORDS.TO)) {
            res.register_advance()
            this.advance()
            let node = res.register(this.funcDef())

            if (res.error !== null)
                return res
            return res.success(node)
        }

        if (this.current_token.isKeyword(Token.KEYWORDS.SAVE) || this.current_token.isKeyword(Token.KEYWORDS.LOAD)) {
            // TODO:
        }

    }

    expression() {
        return this.bin_op(this.term.bind(this), (Token.TYPE.PLUS, Token.TYPE.MINUS))
    }

    term() {
        return this.bin_op(this.factor.bind(this), (Token.TYPE.DIVDE, Token.TYPE.MULTIPLY))
    }

    factor() {
        let res = new ParserResult()
        let t = this.current_token

        if (t.type === Token.TYPE.PLUS || t.type === Token.TYPE.MINUS) {
            res.register_advance()
            this.advance()
            let factor = res.register(this.factor())
            if (res.error !== null)
                return res
            return res.success(
                new UnaryOpNode(t, factor)
            )
        }
        return this.atom()
    }

    atom() {
        let res = new ParserResult()
        let t = this.current_token


        if (t.type === Token.TYPE.NUMBER) {
            res.register_advance()
            this.advance()
            return res.success(new NumberNode(t))
        }

        if (t.type === Token.TYPE.COLON) {
            res.register_advance()
            this.advance()
            t = this.current_token
            if (t !== Token.TYPE.IDENTIFIER) {
                return res.failure(
                    new InvalidSyntaxError(
                        this.current_token.pos_start,
                        this.current_token.pos_end,
                        `Excepted Identifier after ':'`
                    )
                )
            }
            res.register_advance()
            this.advance()
            return res.success(new VarNode(t))
        }

        if (t.type === Token.TYPE.LPAREN) {
            res.register_advance()
            this.advance()
            let node = res.register(this.expression())
            if (res.error !== null)
                return res
            res.register_advance()
            this.advance()
            if (this.current_token.type !== Token.TYPE.RPAREN) {
                return res.failure(
                    new ExceptedCharError(
                        this.current_token.pos_start,
                        this.current_token.pos_end,
                        `)`
                    )
                )
            }
            res.register_advance()
            this.advance()
            return res.success(node)
        }

        if (t.isKeyword(Token.KEYWORDS.WHO)) {
            res.register_advance()
            this.advance()
            return res.success(new NumberNode(t)) //TODO: fix it
        }
    }

    edExpr() {
        let res = new ParserResult()
        let tokens = []
        if (this.current_token.type === Token.TYPE.IDENTIFIER) {
            tokens.push(this.current_token)
        } else if (this.current_token.type === Token.TYPE.LSQUARE) {

            while (this.current_token.type !== Token.TYPE.RSQUARE) {
                res.register_advance()
                this.advance()
                if (this.current_token.type === Token.TYPE.EOF) {
                    return res.failure(
                        new ExceptedCharError(
                            this.current_token.pos_start,
                            this.current_token.pos_end,
                            "]"
                        )
                    )
                }
                if (this.current_token.type !== Token.TYPE.IDENTIFIER) {
                    return res.failure(
                        new InvalidSyntaxError(
                            this.current_token.pos_start,
                            this.current_token.pos_end,
                            "Excepted Identifier"
                        )
                    )
                }
                tokens.push(this.current_token)
            }
        } else {
            return res.failure(
                new InvalidSyntaxError(
                    this.current_token.pos_start,
                    this.current_token.pos_end,
                    "Excepted Identifier or '['"
                )
            )
        }
        return res.success(
            new EdNode(tokens)
        )
    }

    tellExpr() {
        let res = new ParserResult()

        if (this.current_token.type === Token.TYPE.LSQUARE) {
            let nodes = []
            while (this.current_token.type !== Token.TYPE.RSQUARE) {
                res.register_advance()
                this.advance()
                if (this.current_token.type === Token.TYPE.EOF) {
                    return res.failure(
                        new ExceptedCharError(
                            this.current_token.pos_start,
                            this.current_token.pos_end,
                            "]"
                        )
                    )
                }

                expr = res.register(this.expression())
                if (res.error !== null)
                    return res.failure(
                        new InvalidSyntaxError(
                            this.current_token.pos_start,
                            this.current_token.pos_end,
                            "Excepted Expression"
                        )
                    )
                nodes.push(expr)
            }
            res.register_advance()
            this.advance()
            return res.success(
                new TellNode(nodes)
            )
        }

        expr = res.register(this.expression())
        if (res.error !== null)
            return res.failure(
                new InvalidSyntaxError(
                    this.current_token.pos_start,
                    this.current_token.pos_end,
                    "Excepted Expression"
                )
            )
        return res.success(
            new TellNode([expr])
        )
    }

    askExpr() {
        let res = new ParserResult()
        if (this.current_token.type !== Token.TYPE.LSQUARE) {
            return res.failure(
                new ExceptedCharError(
                    this.current_token.pos_start,
                    this.current_token.pos_end,
                    "["
                )
            )
        }

        let nodes = []
        while (this.current_token.type !== Token.TYPE.RSQUARE) {
            res.register_advance()
            this.advance()
            if (this.current_token.type === Token.TYPE.EOF) {
                return res.failure(
                    new ExceptedCharError(
                        this.current_token.pos_start,
                        this.current_token.pos_end,
                        "]"
                    )
                )
            }

            expr = res.register(this.expression())
            if (res.error !== null)
                return res.failure(
                    new InvalidSyntaxError(
                        this.current_token.pos_start,
                        this.current_token.pos_end,
                        "Excepted Expression"
                    )
                )
            nodes.push(expr)
        }
        res.register_advance()
        this.advance()

        if (this.current_token.type !== Token.TYPE.LSQUARE) {
            return res.failure(
                new ExceptedCharError(
                    this.current_token.pos_start,
                    this.current_token.pos_end,
                    "["
                )
            )
        }
        res.register_advance()
        this.advance()

        let body = res.register(this.statments())
        if (res.error !== null)
            return res
        res.register_advance()
        this.advance()
        if (this.current_token.type !== Token.TYPE.RSQUARE) {
            return res.failure(
                new ExceptedCharError(
                    this.current_token.pos_start,
                    this.current_token.pos_end,
                    "]"
                )
            )
        }
        return res.success(
            new AskNode(nodes, body)
        )

    }

    repeatExpr() {
        let res = new ParserResult()

        let numberNode = res.register(this.expression())
        if (res.error !== null)
            return res.failure(
                new InvalidSyntaxError(
                    this.current_token.pos_start,
                    this.current_token.pos_end,
                    "Excepted Expression"
                )
            )

        if (this.current_token.type !== Token.TYPE.LSQUARE) {
            return res.failure(
                new ExceptedCharError(
                    this.current_token.pos_start,
                    this.current_token.pos_end,
                    "["
                )
            )
        }
        res.register_advance()
        this.advance()

        let body = res.register(this.statments())
        if (res.error !== null)
            return res

        if (this.current_token.type !== Token.TYPE.RSQUARE) {
            return res.failure(
                new ExceptedCharError(
                    this.current_token.pos_start,
                    this.current_token.pos_end,
                    "]"
                )
            )
        }
        return res.success(
            new RepeatNode(numberNode, body)
        )
    }

    funcDef() {
        let res = new ParserResult()

        if (this.current_token.type !== Token.TYPE.IDENTIFIER) {
            return res.failure(
                new InvalidSyntaxError(
                    this.current_token.pos_start,
                    this.current_token.pos_end,
                    "Excepted Identifier"
                )
            )
        }
        let name = this.current_token

        res.register_advance()
        this.advance()

        let args = []
        while (this.current_token.type === Token.TYPE.COLON) {
            res.register_advance()
            this.advance()
            if (this.current_token.type !== Token.TYPE.IDENTIFIER) {
                return res.failure(
                    new InvalidSyntaxError(
                        this.current_token.pos_start,
                        this.current_token.pos_end,
                        "Excepted Identifier"
                    )
                )
            }
            args.push(this.current_token)
            res.register_advance()
            this.advance()
        }

        let body = res.register(this.statments())
        if (res.error !== null)
            return res

        if (this.current_token.isKeyword(Token.KEYWORDS.END)) {
            return res.failure(
                new InvalidSyntaxError(
                    this.current_token.pos_start,
                    this.current_token.pos_end,
                    `Excepted ${Token.KEYWORDS.END}`
                )
            )
        }

        return res.success(
            new FunctionNode(name, args, body)
        )


    }

    saveExpr() {}

    loadExpr() {}

}
