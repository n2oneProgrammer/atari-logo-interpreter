const Context = require("../../core/context.js");
const Global = require("../../core/utilities/global.js");
const {
    BuiltInFunction
} = require("../../core/values/function");
const SymbolTable = require("../../core/symbolTable.js");
const WhoValue = require("../../core/values/who");

describe('Context', () => {

    beforeEach(() => {
        Global.initTable();
    })

    it("Context setup", () => {
        let context = new Context("<global>");
        expect(context).toBeInstanceOf(Context);
        expect(context).toHaveProperty("displayName", "<global>");
        expect(context).toHaveProperty("parent", null);
        expect(context).toHaveProperty("parentEntryPos", null);
        expect(context).toHaveProperty("symbolTable", null);

    });

    it("Get global symbol table", () => {
        let symbolTable = Global.getTable();
        expect(symbolTable).toBeInstanceOf(SymbolTable);
        expect(symbolTable).toHaveProperty("parent", null);
        expect(symbolTable).toHaveProperty("symbols");
        expect(symbolTable.symbols).toHaveProperty("$who");
        ['cs', 'ht', 'st', 'pu', 'pd', 'rt', 'lt', 'fd', 'bk', 'setc', 'setpn', 'setpc', 'pots', 'erall'].forEach(symbol => {
            expect(symbolTable.symbols[symbol]).toBeInstanceOf(BuiltInFunction);
        });
    });

    it("Generate new symbol table", () => {
        let context = new Context("<global>");
        context.symbolTable = Global.getTable();
        let newContext = context.generateNewSymbolTable("<new>");
        expect(newContext).toBeInstanceOf(Context);
        expect(newContext).toHaveProperty("displayName", "<new>");
        expect(newContext).toHaveProperty("parent", context);
        expect(newContext).toHaveProperty("parentEntryPos", null);
        expect(newContext).toHaveProperty("symbolTable");
        expect(newContext.symbolTable).toBeInstanceOf(SymbolTable);
        expect(newContext.symbolTable).toHaveProperty("parent", context.symbolTable);
        expect(newContext.symbolTable).toHaveProperty("symbols");
        expect(newContext.symbolTable.symbols).toMatchObject({})
    });

    it("Get values from symbol table", () => {
        let context = new Context("<global>");
        context.symbolTable = Global.getTable();
        expect(context.symbolTable.get("cs")).toBeInstanceOf(BuiltInFunction);
    })

    it("Get values from parent symbol table", () => {
        let context = new Context("<global>");
        context.symbolTable = Global.getTable();
        let newContext = context.generateNewSymbolTable("<new>");
        expect(newContext.symbolTable.get("cs")).toBeInstanceOf(BuiltInFunction);
    })

    it("Set values to symbol table", () => {
        let context = new Context("<global>");
        context.symbolTable = Global.getTable();
        let newContext = context.generateNewSymbolTable("<new>");
        let obj = new BuiltInFunction("xd", [], null)
        newContext.symbolTable.set("xd", obj);
        expect(newContext.symbolTable.get("xd")).toBe(obj);
    });

    it("Set who to symbol table", () => {
        let context = new Context("<global>");
        context.symbolTable = Global.getTable();
        let newContext = context.generateNewSymbolTable("<new>");
        newContext.symbolTable.setWho([1, 2, 3]);
        expect(newContext.symbolTable.get("$who")).toBeInstanceOf(WhoValue);
        expect(newContext.symbolTable.get("$who").data).toMatchObject([1, 2, 3]);
    });

    it("Get all global functions", () => {
        let context = new Context("<global>");
        context.symbolTable = Global.getTable();
        let newContext = context.generateNewSymbolTable("<new>");
        let obj = new BuiltInFunction("xd", [], null)
        newContext.symbolTable.set("xd", obj);
        expect(newContext.symbolTable.getAllGlobalFunc().length).toBe(14);
    });

    it("Get all functions", () => {
        let context = new Context("<global>");
        context.symbolTable = Global.getTable();
        let newContext = context.generateNewSymbolTable("<new>");
        let obj = new BuiltInFunction("xd", [], null)
        newContext.symbolTable.set("xd", obj);
        expect(newContext.symbolTable.getAllFunc().length).toBe(15);
    });

    it("Remove value from symbol table", () => {
        let context = new Context("<global>");
        context.symbolTable = Global.getTable();
        expect(context.symbolTable.get('cs')).toBeInstanceOf(BuiltInFunction);
        context.symbolTable.remove('cs');
        expect(context.symbolTable.get('cs')).toBe(null);
    });

});
