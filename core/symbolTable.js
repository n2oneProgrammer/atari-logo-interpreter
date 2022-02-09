const WhoValue = require('./values/who');

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

    setWho(value) {
        if (this.parent != null) {
            this.parent.setWho(value);
        }
        this.set("$who", new WhoValue(value));
    }

    remove(name) {
        delete this.symbols[name];
    }
};
