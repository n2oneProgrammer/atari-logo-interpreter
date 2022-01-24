const SymbolTable = require('../symbolTable');

module.exports = function globalSymbolTable() {
    let table = new SymbolTable();
    return table
};
