const SymbolTable = require('../symbolTable');
const NumberValue = require('../values/number');

let table = new SymbolTable();
table.set("$who", new NumberValue(0));

module.exports = function globalSymbolTable() {
    return table
};
