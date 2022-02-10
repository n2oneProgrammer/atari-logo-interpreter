const SymbolTable = require('../symbolTable');
const WhoValue = require('../values/who');
const InterpereterObjects = require('../interpereterObjects');
const {
    cs,
    ht,
    st,
    pu,
    pd,
    rt,
    lt,
    fd,
    bk,
    setc,
    setpn,
    setpc,
    pots,
    erall
} = require('../values/buildInFuncions');

let table = new SymbolTable();
table.set("$who", new WhoValue([0]));
table.setBuildInFunction(new cs());
table.setBuildInFunction(new ht());
table.setBuildInFunction(new st());
table.setBuildInFunction(new pu());
table.setBuildInFunction(new pd());
table.setBuildInFunction(new rt());
table.setBuildInFunction(new lt());
table.setBuildInFunction(new fd());
table.setBuildInFunction(new bk());
table.setBuildInFunction(new setc());
table.setBuildInFunction(new setpn());
table.setBuildInFunction(new setpc());
table.setBuildInFunction(new pots());
table.setBuildInFunction(new erall());
let interpreterObjects = new InterpereterObjects();

module.exports = {
    globalSymbolTable() {
        return table;
    },
    interpreterObjects() {
        return interpreterObjects;
    }
}
