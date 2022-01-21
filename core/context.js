const SymbolTable = require('./symbolTable');

module.exports = class Context {
    constructor(displayName, parent = null, parentEntryPos = null) {
        this.displayName = displayName;
        this.parent = parent;
        this.parentEntryPos = parentEntryPos;
        this.symbolTable = null;
    }

    generateNewSymbolTable(name, pos_start = null) {
        newContext = new Context(name, this, pos_start === null ? this.parentEntryPos : pos_start);
        newContext.symbolTable = new SymbolTable(newContext.parent.symbolTable);
        return newContext;
    }
}
