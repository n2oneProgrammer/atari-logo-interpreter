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

    set(name, value) {
        this.symbols[name] = value;
    }

    remove(name) {
        delete this.symbols[name];
    }
};
