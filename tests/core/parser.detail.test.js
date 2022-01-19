import Lexer from '../../core/lexer';
import Parser from '../../core/parser';
import {
    ParserResult
} from '../../core/utilities/parser';
import {
    ListNode,
    RepeatNode,
    TellNode,
    EdNode,
    SaveLoadNode,
    FunctionNode,
    CallNode,
    AskNode
} from '../../core/node';

import {
    ExceptedCharError,
    InvalidSyntaxError
} from '../../core/error';

describe('Parser Detail', () => {
    it("Repeat", () => {
        let result = new Lexer("test", "REPEAT 5 [ED xd]").run();
        let parser = new Parser(result.tokens).run();
        expect(parser).toBeInstanceOf(ParserResult);
        expect(parser.node).toBeInstanceOf(ListNode);
        expect(parser.node.nodes.length).toBe(1);
        expect(parser.node.nodes[0]).toBeInstanceOf(RepeatNode)
    })

    it("Tell 1", () => {
        let result = new Lexer("test", "TELL 3").run();
        let parser = new Parser(result.tokens).run();
        expect(parser).toBeInstanceOf(ParserResult);
        expect(parser.node).toBeInstanceOf(ListNode);
        expect(parser.node.nodes.length).toBe(1);
        expect(parser.node.nodes[0]).toBeInstanceOf(TellNode)
    })


    it("Tell 2", () => {
        let result = new Lexer("test", "TELL [4+5 2 1]").run();
        let parser = new Parser(result.tokens).run();
        expect(parser).toBeInstanceOf(ParserResult);
        expect(parser.node).toBeInstanceOf(ListNode);
        expect(parser.node.nodes.length).toBe(1);
        expect(parser.node.nodes[0]).toBeInstanceOf(TellNode)
    })

    it("SAVE", () => {
        let result = new Lexer("test", "SAVE this/is/path").run();
        let parser = new Parser(result.tokens).run();
        expect(parser).toBeInstanceOf(ParserResult);
        expect(parser.node).toBeInstanceOf(ListNode);
        expect(parser.node.nodes.length).toBe(1);
        expect(parser.node.nodes[0]).toBeInstanceOf(SaveLoadNode)
    })

    it("LOAD", () => {
        let result = new Lexer("test", "LOAD this/is/path").run();
        let parser = new Parser(result.tokens).run();
        expect(parser).toBeInstanceOf(ParserResult);
        expect(parser.node).toBeInstanceOf(ListNode);
        expect(parser.node.nodes.length).toBe(1);
        expect(parser.node.nodes[0]).toBeInstanceOf(SaveLoadNode)
    })

    it("ED 1", () => {
        let result = new Lexer("test", "ED cos").run();
        let parser = new Parser(result.tokens).run();
        expect(parser).toBeInstanceOf(ParserResult);
        expect(parser.node).toBeInstanceOf(ListNode);
        expect(parser.node.nodes.length).toBe(1);
        expect(parser.node.nodes[0]).toBeInstanceOf(EdNode)
    })

    it("ED 2", () => {
        let result = new Lexer("test", "ED [f1 f2]").run();
        let parser = new Parser(result.tokens).run();
        expect(parser).toBeInstanceOf(ParserResult);
        expect(parser.node).toBeInstanceOf(ListNode);
        expect(parser.node.nodes.length).toBe(1);
        expect(parser.node.nodes[0]).toBeInstanceOf(EdNode)
    })

    it("Func def 1", () => {
        let result = new Lexer("test", "TO func :xd :cos RT :xd FW 100 LR FW 100 END").run();
        let parser = new Parser(result.tokens).run();
        expect(parser).toBeInstanceOf(ParserResult);
        expect(parser.node).toBeInstanceOf(ListNode);
        expect(parser.node.nodes.length).toBe(1);
        expect(parser.node.nodes[0]).toBeInstanceOf(FunctionNode)
    })

    it("Func def 2", () => {
        let result = new Lexer("test", "TO func RT FW 100 LR FW 100 END").run();
        let parser = new Parser(result.tokens).run();
        expect(parser).toBeInstanceOf(ParserResult);
        expect(parser.node).toBeInstanceOf(ListNode);
        expect(parser.node.nodes.length).toBe(1);
        expect(parser.node.nodes[0]).toBeInstanceOf(FunctionNode)
    })

    it("WHO", () => {
        let result = new Lexer("test", "FUNC 10 WHO").run();
        let parser = new Parser(result.tokens).run();
        expect(parser).toBeInstanceOf(ParserResult);
        expect(parser.node).toBeInstanceOf(ListNode);
        expect(parser.node.nodes.length).toBe(1);
        expect(parser.node.nodes[0]).toBeInstanceOf(CallNode)
    })

    it("ASK", () => {
        let result = new Lexer("test", "ASK [0] [LR FW 10]").run();
        let parser = new Parser(result.tokens).run();
        expect(parser).toBeInstanceOf(ParserResult);
        expect(parser.node).toBeInstanceOf(ListNode);
        expect(parser.node.nodes.length).toBe(1);
        expect(parser.node.nodes[0]).toBeInstanceOf(AskNode)
    })

})
