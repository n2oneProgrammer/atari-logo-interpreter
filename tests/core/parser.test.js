import Lexer from '../../core/lexer';
import Parser from '../../core/parser';
import {
    ParserResult
} from '../../core/utilities/parser';
import {
    ListNode,
    RepeatNode,
    EdNode,
    BinaryOperationNode,
    NumberNode
} from '../../core/node';

import {
    ExceptedCharError,
    InvalidSyntaxError
} from '../../core/error';

describe('Parser', () => {

    it("Repeat valid", () => {
        let result = new Lexer("test", "REPEAT 5 [ED xd]").run();
        let parser = new Parser(result.tokens).run();
        expect(parser).toBeInstanceOf(ParserResult);
        expect(parser.node).toBeInstanceOf(ListNode);
        expect(parser.node.nodes.length).toBe(1);
        expect(parser.node.nodes[0]).toBeInstanceOf(RepeatNode);
        expect(parser.node.nodes[0].numberNode.token.value).toBe("5");
        expect(parser.node.nodes[0].body).toBeInstanceOf(ListNode);
        expect(parser.node.nodes[0].body.nodes.length).toBe(1);
        expect(parser.node.nodes[0].body.nodes[0]).toBeInstanceOf(EdNode);
    })

    it("Repeat invalid", () => {
        let result = new Lexer("test", "REPEAT 5 []").run();
        let parser = new Parser(result.tokens).run();
        expect(parser).toBeInstanceOf(ParserResult);
        expect(parser.error).toBeInstanceOf(InvalidSyntaxError);
    })

    it("Repeat invalid 2", () => {
        let result = new Lexer("test", "REPEAT 5 [ ED cos").run();
        let parser = new Parser(result.tokens).run();
        expect(parser).toBeInstanceOf(ParserResult);
        expect(parser.error).toBeInstanceOf(ExceptedCharError);
    })

    it("Repeat valid 2", () => {
        let result = new Lexer("test", "ED cos REPEAT 5 [REPEAT 23 [ED cos] ED cos]").run();
        let parser = new Parser(result.tokens).run();
        expect(parser).toBeInstanceOf(ParserResult);
        expect(parser.node).toBeInstanceOf(ListNode);
        expect(parser.node.nodes.length).toBe(2);
        expect(parser.node.nodes[0]).toBeInstanceOf(EdNode);
        expect(parser.node.nodes[1]).toBeInstanceOf(RepeatNode);

        expect(parser.node.nodes[1].numberNode.token.value).toBe("5");
        expect(parser.node.nodes[1].body).toBeInstanceOf(ListNode);
        expect(parser.node.nodes[1].body.nodes.length).toBe(2);
        expect(parser.node.nodes[1].body.nodes[0]).toBeInstanceOf(RepeatNode);
        expect(parser.node.nodes[1].body.nodes[1]).toBeInstanceOf(EdNode);

        expect(parser.node.nodes[1].body.nodes[0].numberNode.token.value).toBe("23");
        expect(parser.node.nodes[1].body.nodes[0].body).toBeInstanceOf(ListNode);
        expect(parser.node.nodes[1].body.nodes[0].body.nodes.length).toBe(1);
        expect(parser.node.nodes[1].body.nodes[0].body.nodes[0]).toBeInstanceOf(EdNode);
    })

    it("Valid expresions", () => {
        let result = new Lexer("test", "REPEAT ((2+(2/1)*2)-1) [ED cos]").run();
        let parser = new Parser(result.tokens).run();
        expect(parser).toBeInstanceOf(ParserResult);
        expect(parser.node).toBeInstanceOf(ListNode);
        expect(parser.node.nodes.length).toBe(1);
        expect(parser.node.nodes[0]).toBeInstanceOf(RepeatNode);

        expect(parser.node.nodes[0].numberNode.left.right.left).toBeInstanceOf(BinaryOperationNode)
    })



});
