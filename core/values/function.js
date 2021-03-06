const Value = require('./value');
const {
    RuntimeError
} = require('../error');
const RuntimeResult = require('../utilities/runtimeResult');

class BaseFunction extends Value {
    constructor(name) {
        super();
        this.name = name;
    }

    toString() {
        return `<${this.name}>`;
    }

    setObjcts(obj) {
        this.objcts = obj;
        return this;
    }

    CheckArgs(argNames, args) {
        let res = new RuntimeResult();
        if (args.length !== argNames.length) {
            return res.failure(new RuntimeError(this.pos_start, this.pos_end, `Expected ${argNames.length} arguments but got ${args.length}`, this.context));
        }
        return res.success(null);
    }

    PopulateArgs(argNames, args, context) {
        for (let i = 0; i < argNames.length; i++) {
            let argName = argNames[i];
            let arg = args[i];
            arg.setContext(context);
            context.symbolTable.set(argName, arg);
        }
    }

    CheckAndPopulateArgs(argNames, args, context) {
        let res = new RuntimeResult();
        res.register(this.CheckArgs(argNames, args));
        if (res.error) return res;
        this.PopulateArgs(argNames, args, context);
        return res.success(null);
    }

}
class FunctionValue extends BaseFunction {
    constructor(name, body_node, argNames, text, strBody) {
        super(name);
        this.body_node = body_node;
        this.argNames = argNames;
        this.text = text;
        this.strBody = strBody;
    }

    toString() {
        return `<${this.text}>`;
    }

    copy() {
        let copy = new FunctionValue(this.name, this.body_node, this.argNames, this.text, this.strBody);
        copy.setPosition(this.pos_start, this.pos_end);
        copy.setContext(this.context);
        return copy;
    }

    execute(args) {
        let res = new RuntimeResult();
        let context = this.context.generateNewSymbolTable(this.name, this.pos_start);

        res.register(this.CheckAndPopulateArgs(this.argNames, args, context));
        if (res.error) return res;

        const Interpreter = require('../interpreter');
        let interpreter = new Interpreter(this.objcts);
        res.register(interpreter.visit(this.body_node, context));
        if (res.error) return res;

        return res.success(null);
    }
}

class BuiltInFunction extends BaseFunction {
    constructor() {
        super("");
        this.name = this.constructor.name;
    }

    toString() {
        return `<$${this.name}>`;
    }

    copy(_class) {
        let copy = new _class(this.name);
        copy.setPosition(this.pos_start, this.pos_end);
        copy.setContext(this.context);
        return copy;
    }

    run() {
        throw new Error("Not implemented");
    }

    getAgrNames() {
        throw new Error("Not implemented");
    }

    _execute(args, agrNames, run) {
        let res = new RuntimeResult();
        let context = this.context.generateNewSymbolTable(this.name, this.pos_start);

        res.register(this.CheckAndPopulateArgs(agrNames, args, context));
        if (res.error) return res;

        res.register(run(context));
        if (res.error) return res;

        return res.success(null);
    }

};


module.exports = {
    BaseFunction,
    FunctionValue,
    BuiltInFunction
};
