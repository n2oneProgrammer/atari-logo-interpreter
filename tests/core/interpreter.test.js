const Interpeter = require('../../core/interpreter');
const {
    ListNode,
    RepeatNode,
    TellNode,
    EdNode,
    SaveLoadNode,
    FunctionNode,
    CallNode,
    AskNode,
    EachNode,
    UnaryOperationNode,
    BinaryOperationNode,
    NumberNode,
    VarNode
} = require('../../core/node');
const Token = require('../../core/token');
const Position = require('../../core/position');
const NumberValue = require('../../core/values/number');
const {
    RuntimeError
} = require('../../core/error');
const Context = require("../../core/context.js");
0
const SymbolTable = require("../../core/symbolTable.js");
const WhoValue = require("../../core/values/who");
const {
    FunctionValue,
    BuiltInFunction
} = require("../../core/values/function");
const RuntimeResult = require("../../core/utilities/runtimeResult");


describe('Interpreter', () => {

    const testFunc = (mock, context) => {
        class test extends BuiltInFunction {

            copy() {
                return super.copy(test);
            }

            execute(args) {
                return super._execute(args, [], (context) => {
                    mock();

                    return new RuntimeResult().success(null);
                });
            }
        }
        context.symbolTable.setBuildInFunction(new test());
    }


    it('Initalize', () => {
        let interpreter = new Interpeter(null);
        expect(interpreter).toBeDefined();
    });

    it('No visit method', () => {
        let interpreter = new Interpeter(null);
        class Test {}
        expect(() => {
            interpreter.visit(new Test(), null);
        }).toThrow();
    });

    it('Visit NumberNode', () => {
        let interpreter = new Interpeter(null);
        let node = new NumberNode(new Token(Token.TYPE.NUMBER, 1, null, new Position(-1, 0, -1, "fn", "text")));
        let result = interpreter.visit(node, null);
        expect(result.value).toBeInstanceOf(NumberValue);
        expect(result.value.value).toBe(1);
    });

    it('Visit VarNode Error', () => {
        let interpreter = new Interpeter(null);
        let node = new VarNode(new Token(Token.TYPE.IDENTIFIER, 'a', null, new Position(-1, 0, -1, "fn", "text")));
        let result = interpreter.visit(node, null);
        expect(result.value).toBe(null);
        expect(result.error).toBeInstanceOf(RuntimeError);
    });

    it('Visit VarNode Number', () => {
        let context = new Context("<global>");
        context.symbolTable = new SymbolTable();
        context.symbolTable.set("a", new NumberValue(1));
        let interpreter = new Interpeter(context);
        let node = new VarNode(new Token(Token.TYPE.IDENTIFIER, 'a', null, new Position(-1, 0, -1, "fn", "text")));
        let result = interpreter.visit(node, context);
        expect(result.value).toBeInstanceOf(NumberValue);
        expect(result.value.value).toBe(1);
    });

    it('Visit VarNode Who', () => {
        let context = new Context("<global>");
        context.symbolTable = new SymbolTable();
        context.symbolTable.set("a", new WhoValue([0, 1]));
        let interpreter = new Interpeter(context);
        let node = new VarNode(new Token(Token.TYPE.IDENTIFIER, 'a', null, new Position(-1, 0, -1, "fn", "text")));
        let result = interpreter.visit(node, context);
        expect(result.value).toBeInstanceOf(WhoValue);
        expect(result.value.value).toBe(0);
        expect(result.value.data).toEqual([0, 1]);
    });

    it('Visit VarNode Function', () => {
        let context = new Context("<global>");
        context.symbolTable = new SymbolTable();
        context.symbolTable.set("a", new FunctionValue("a", [], [], "", ""));
        let interpreter = new Interpeter(context);
        let node = new VarNode(new Token(Token.TYPE.IDENTIFIER, 'a', null, new Position(-1, 0, -1, "fn", "text")));
        let result = interpreter.visit(node, context);
        expect(result.value).toBeInstanceOf(FunctionValue);
        expect(result.value.name).toBe("a");
    });

    it('Visit BinaryOperationNode plus', () => {
        let interpreter = new Interpeter(null);
        let node = new BinaryOperationNode(
            new Token(Token.TYPE.PLUS, '+', null, new Position(-1, 0, -1, "fn", "text")),
            new NumberNode(new Token(Token.TYPE.NUMBER, 1, null, new Position(-1, 0, -1, "fn", "text"))),
            new NumberNode(new Token(Token.TYPE.NUMBER, 2, null, new Position(-1, 0, -1, "fn", "text"))));
        let result = interpreter.visit(node, null);
        expect(result.value).toBeInstanceOf(NumberValue);
        expect(result.value.value).toBe(3);
    })

    it('Visit BinaryOperationNode minus', () => {
        let interpreter = new Interpeter(null);
        let node = new BinaryOperationNode(
            new Token(Token.TYPE.MINUS, '-', null, new Position(-1, 0, -1, "fn", "text")),
            new NumberNode(new Token(Token.TYPE.NUMBER, 1, null, new Position(-1, 0, -1, "fn", "text"))),
            new NumberNode(new Token(Token.TYPE.NUMBER, 2, null, new Position(-1, 0, -1, "fn", "text"))));
        let result = interpreter.visit(node, null);
        expect(result.value).toBeInstanceOf(NumberValue);
        expect(result.value.value).toBe(-1);
    });

    it('Visit BinaryOperationNode multiply', () => {
        let interpreter = new Interpeter(null);
        let node = new BinaryOperationNode(
            new Token(Token.TYPE.MULTIPLY, '*', null, new Position(-1, 0, -1, "fn", "text")),
            new NumberNode(new Token(Token.TYPE.NUMBER, 1, null, new Position(-1, 0, -1, "fn", "text"))),
            new NumberNode(new Token(Token.TYPE.NUMBER, 2, null, new Position(-1, 0, -1, "fn", "text"))));
        let result = interpreter.visit(node, null);
        expect(result.value).toBeInstanceOf(NumberValue);
        expect(result.value.value).toBe(2);
    });

    it('Visit BinaryOperationNode divide', () => {
        let interpreter = new Interpeter(null);
        let node = new BinaryOperationNode(
            new Token(Token.TYPE.DIVDE, '/', null, new Position(-1, 0, -1, "fn", "text")),
            new NumberNode(new Token(Token.TYPE.NUMBER, 1, null, new Position(-1, 0, -1, "fn", "text"))),
            new NumberNode(new Token(Token.TYPE.NUMBER, 2, null, new Position(-1, 0, -1, "fn", "text"))));
        let result = interpreter.visit(node, null);
        expect(result.value).toBeInstanceOf(NumberValue);
        expect(result.value.value).toBe(0);
    });

    it('Visit UnaryOperationNode plus', () => {
        let interpreter = new Interpeter(null);
        let node = new UnaryOperationNode(
            new Token(Token.TYPE.PLUS, '+', null, new Position(-1, 0, -1, "fn", "text")),
            new NumberNode(new Token(Token.TYPE.NUMBER, 1, null, new Position(-1, 0, -1, "fn", "text"))));
        let result = interpreter.visit(node, null);
        expect(result.value).toBeInstanceOf(NumberValue);
        expect(result.value.value).toBe(1);
    });

    it('Visit UnaryOperationNode minus', () => {
        let interpreter = new Interpeter(null);
        let node = new UnaryOperationNode(
            new Token(Token.TYPE.MINUS, '-', null, new Position(-1, 0, -1, "fn", "text")),
            new NumberNode(new Token(Token.TYPE.NUMBER, 1, null, new Position(-1, 0, -1, "fn", "text"))));
        let result = interpreter.visit(node, null);
        expect(result.value).toBeInstanceOf(NumberValue);
        expect(result.value.value).toBe(-1);
    });

    it('Visit ListNode', () => {
        let context = new Context("<global>");
        context.symbolTable = new SymbolTable();
        let mock = jest.fn();
        testFunc(mock, context);
        context.symbolTable.set("a", new NumberValue(1));
        context.symbolTable.set("b", new NumberValue(2));
        let interpreter = new Interpeter(context);
        let node = new ListNode([
            new VarNode(new Token(Token.TYPE.IDENTIFIER, 'a', null, new Position(-1, 0, -1, "fn", "text"))),
            new VarNode(new Token(Token.TYPE.IDENTIFIER, 'b', null, new Position(-1, 0, -1, "fn", "text"))),
            new CallNode(new VarNode(new Token(Token.TYPE.IDENTIFIER, 'test', null, new Position(-1, 0, -1, "fn", "text"))), [])
        ]);
        let result = interpreter.visit(node, context);
        expect(result.value).toEqual(null);
        expect(result.error).toEqual(null);
        expect(mock).toHaveBeenCalledTimes(1);
    });

    it('Visit ListNode error', () => {
        let context = new Context("<global>");
        context.symbolTable = new SymbolTable();
        context.symbolTable.set("a", new NumberValue(1));
        let interpreter = new Interpeter(context);
        let node = new ListNode([
            new VarNode(new Token(Token.TYPE.IDENTIFIER, 'a', null, new Position(-1, 0, -1, "fn", "text"))),
            new VarNode(new Token(Token.TYPE.IDENTIFIER, 'b', null, new Position(-1, 0, -1, "fn", "text")))
        ]);
        let result = interpreter.visit(node, context);
        expect(result.value).toEqual(null);
        expect(result.error).toBeInstanceOf(RuntimeError);
    });

    it('Visit RepeatNode', () => {
        let context = new Context("<global>");
        context.symbolTable = new SymbolTable();
        let mock = jest.fn();
        testFunc(mock, context);
        let interpreter = new Interpeter(context);
        let node = new RepeatNode(
            new NumberNode(new Token(Token.TYPE.NUMBER, 2, null, new Position(-1, 0, -1, "fn", "text"))),
            new ListNode([
                new CallNode(new VarNode(new Token(Token.TYPE.IDENTIFIER, 'test', null, new Position(-1, 0, -1, "fn", "text"))), [])
            ]));
        let result = interpreter.visit(node, context);
        expect(result.value).toEqual(null);
        expect(result.error).toEqual(null);
        expect(mock).toHaveBeenCalledTimes(2);
    })

    it('Visit RepeatNode Error', () => {
        let context = new Context("<global>");
        context.symbolTable = new SymbolTable();
        let interpreter = new Interpeter(context);
        let node = new RepeatNode(
            new NumberNode(new Token(Token.TYPE.NUMBER, 2, null, new Position(-1, 0, -1, "fn", "text"))),
            new ListNode([
                new CallNode(new VarNode(new Token(Token.TYPE.IDENTIFIER, 'a', null, new Position(-1, 0, -1, "fn", "text"))), [])
            ]));
        let result = interpreter.visit(node, context);
        expect(result.value).toEqual(null);
        expect(result.error).toBeInstanceOf(RuntimeError);
    })
});
