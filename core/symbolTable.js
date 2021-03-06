const WhoValue = require('./values/who');
const {
    BaseFunction
} = require('./values/function');

module.exports = class SymbolTable {
    constructor(parent = null) {
        this.symbols = {};
        this.parent = parent;
    }

    get(name) {
        if (this.symbols[name] != undefined) {
            return this.symbols[name];
        }

        if (this.parent != null) {
            return this.parent.get(name);
        }

        return null;
    }

    getAllGlobalFunc() {
        if (this.parent != null) {
            return this.parent.getAllGlobalFunc();
        }
        let funcs = [];
        for (const [key, value] of Object.entries(this.symbols)) {
            if (value instanceof BaseFunction) {
                funcs.push(value);
            }
        }
        return funcs;
    }

    getAllFunc() {
        let funcs = [];
        if (this.parent != null) {
            funcs = this.parent.getAllFunc();
        }
        for (const [key, value] of Object.entries(this.symbols)) {
            if (value instanceof BaseFunction) {
                funcs.push(value);
            }
        }
        return funcs;
    }

    set(name, value) {
        this.symbols[name] = value;
    }

    setWho(value) {
        if (this.parent != null) {
            this.parent.setWho(value);
        }
        this.set("$who", new WhoValue(value));
    }

    setBuildInFunction(obj) {
        this.set(obj.name, obj);
    }

    remove(name) {
        if (this.symbols[name] != undefined) {
            delete this.symbols[name];
        }
        if (this.parent != null) {
            this.parent.remove(name);
        }
    }

    toString() {
        let r = "Symbol Table:\n";
        for (const [key, value] of Object.entries(this.symbols)) {
            r += `  ${key}: ${value.toString()}\n`;
        }
        return r;
    }

}
