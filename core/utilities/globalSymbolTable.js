const SymbolTable = require('../symbolTable');

let table = new SymbolTable();

module.exports = function globalSymbolTable() {
    return table
};
