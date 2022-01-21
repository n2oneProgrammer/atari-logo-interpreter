const Value = require('./value');
const {
    RuntimeError
} = require('../error');
const RuntimeResult = require('../utilities/runtimeResult');
const Interpreter = require('../interpreter');

class BaseFunction extends Value {
    constructor(name) {
        super();
        this.name = name;
    }

    CheckArgs(argNames, args) {
        let res = new RuntimeResult();
        if (args.length !== argNames.length) {
            return res.failure(new RuntimeError(this.pos_start, this.pos_end, `Expected ${this.argNames.length} arguments but got ${args.length}`, this.context));
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
    constructor(name, body_node, argNames) {
        super(name);
        this.body_node = body_node;
        this.argNames = argNames;
    }

    copy() {
        let copy = new FunctionValue(this.name, this.body_node, this.argNames);
        copy.setPosition(this.pos_start, this.pos_end);
        copy.setContext(this.context);
        return copy;
    }

    execute(args) {
        let res = new RuntimeResult();
        let context = this.context.generateNewSymbolTable(this.name, this.pos_start);

        res.register(this.CheckAndPopulateArgs(this.argNames, args, context));
        if (res.error) return res;

        let interpreter = new Interpreter();
        res.register(interpreter.visit(this.body_node, context));
        if (res.error) return res;

        return res.success(null);
    }
}

module.exports = {
    BaseFunction,
    Function: FunctionValue
}
