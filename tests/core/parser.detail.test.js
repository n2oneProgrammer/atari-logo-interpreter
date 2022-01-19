const Lexer = require('../../core/lexer');
const Parser = require('../../core/parser');
const {
    ParserResult
} = require('../../core/utilities/parser');
const {
    ListNode,
    RepeatNode,
    TellNode,
    EdNode,
    SaveLoadNode,
    FunctionNode,
    CallNode,
    AskNode
} = require('../../core/node');


describe('Parser Detail', () => {

    it("Repeat", () => {
        let result = new Lexer("test", "REPEAT 5 [ED xd] FW 100").run();
        let parser = new Parser(result.tokens).run();
        expect(parser).toBeInstanceOf(ParserResult);
        expect(parser.node).toBeInstanceOf(ListNode);
        expect(parser.node.nodes.length).toBe(2);
        expect(parser.node.nodes[0]).toBeInstanceOf(RepeatNode);
    });

    it("Tell 1", () => {
        let result = new Lexer("test", "TELL 3 FW 100").run();
        let parser = new Parser(result.tokens).run();
        expect(parser).toBeInstanceOf(ParserResult);
        expect(parser.node).toBeInstanceOf(ListNode);
        expect(parser.node.nodes.length).toBe(2);
        expect(parser.node.nodes[0]).toBeInstanceOf(TellNode);
    });


    it("Tell 2", () => {
        let result = new Lexer("test", "TELL [4+5 2 1] FW 100").run();
        let parser = new Parser(result.tokens).run();
        expect(parser).toBeInstanceOf(ParserResult);
        expect(parser.node).toBeInstanceOf(ListNode);
        expect(parser.node.nodes.length).toBe(2);
        expect(parser.node.nodes[0]).toBeInstanceOf(TellNode);
    });

    it("SAVE", () => {
        let result = new Lexer("test", "SAVE this/is/path FW 100").run();
        let parser = new Parser(result.tokens).run();
        expect(parser).toBeInstanceOf(ParserResult);
        expect(parser.node).toBeInstanceOf(ListNode);
        expect(parser.node.nodes.length).toBe(2);
        expect(parser.node.nodes[0]).toBeInstanceOf(SaveLoadNode);
    });

    it("LOAD", () => {
        let result = new Lexer("test", "LOAD this/is/path FW 100").run();
        let parser = new Parser(result.tokens).run();
        expect(parser).toBeInstanceOf(ParserResult);
        expect(parser.node).toBeInstanceOf(ListNode);
        expect(parser.node.nodes.length).toBe(2);
        expect(parser.node.nodes[0]).toBeInstanceOf(SaveLoadNode);
    });

    it("ED 1", () => {
        let result = new Lexer("test", "ED cos FW 100").run();
        let parser = new Parser(result.tokens).run();
        expect(parser).toBeInstanceOf(ParserResult);
        expect(parser.node).toBeInstanceOf(ListNode);
        expect(parser.node.nodes.length).toBe(2);
        expect(parser.node.nodes[0]).toBeInstanceOf(EdNode);
    });

    it("ED 2", () => {
        let result = new Lexer("test", "ED [f1 f2] FW 100").run();
        let parser = new Parser(result.tokens).run();
        expect(parser).toBeInstanceOf(ParserResult);
        expect(parser.node).toBeInstanceOf(ListNode);
        expect(parser.node.nodes.length).toBe(2);
        expect(parser.node.nodes[0]).toBeInstanceOf(EdNode);
    });

    it("Func def 1", () => {
        let result = new Lexer("test", "TO func :xd :cos RT :xd FW 100 LR FW 100 END FW 100").run();
        let parser = new Parser(result.tokens).run();
        expect(parser).toBeInstanceOf(ParserResult);
        expect(parser.node).toBeInstanceOf(ListNode);
        expect(parser.node.nodes.length).toBe(2);
        expect(parser.node.nodes[0]).toBeInstanceOf(FunctionNode);
    });

    it("Func def 2", () => {
        let result = new Lexer("test", "TO func RT FW 100 LR FW 100 END FW 100").run();
        let parser = new Parser(result.tokens).run();
        expect(parser).toBeInstanceOf(ParserResult);
        expect(parser.node).toBeInstanceOf(ListNode);
        expect(parser.node.nodes.length).toBe(2);
        expect(parser.node.nodes[0]).toBeInstanceOf(FunctionNode);
    });

    it("WHO", () => {
        let result = new Lexer("test", "FUNC 10 WHO FW 100").run();
        let parser = new Parser(result.tokens).run();
        expect(parser).toBeInstanceOf(ParserResult);
        expect(parser.node).toBeInstanceOf(ListNode);
        expect(parser.node.nodes.length).toBe(2);
        expect(parser.node.nodes[0]).toBeInstanceOf(CallNode);
    });

    it("ASK", () => {
        let result = new Lexer("test", "ASK [0] [LR FW 10] FW 100").run();
        let parser = new Parser(result.tokens).run();
        expect(parser).toBeInstanceOf(ParserResult);
        expect(parser.node).toBeInstanceOf(ListNode);
        expect(parser.node.nodes.length).toBe(2);
        expect(parser.node.nodes[0]).toBeInstanceOf(AskNode);
    });



});
