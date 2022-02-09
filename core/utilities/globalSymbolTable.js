const SymbolTable = require('../symbolTable');
const WhoValue = require('../values/who');
const InterpereterObjects = require('../interpereterObjects');

let table = new SymbolTable();
table.set("$who", new WhoValue([0]));
let interpreterObjects = new InterpereterObjects();

module.exports = {
    globalSymbolTable() {
        return table;
    },
    interpreterObjects() {
        return interpreterObjects;
    }
}
