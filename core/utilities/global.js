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

module.exports = class Global {
    static table = null;
    static interpreterObjects = null;
    static initTable() {
        Global.table = new SymbolTable();
        Global.table.set("$who", new WhoValue([0]));
        Global.table.setBuildInFunction(new cs());
        Global.table.setBuildInFunction(new ht());
        Global.table.setBuildInFunction(new st());
        Global.table.setBuildInFunction(new pu());
        Global.table.setBuildInFunction(new pd());
        Global.table.setBuildInFunction(new rt());
        Global.table.setBuildInFunction(new lt());
        Global.table.setBuildInFunction(new fd());
        Global.table.setBuildInFunction(new bk());
        Global.table.setBuildInFunction(new setc());
        Global.table.setBuildInFunction(new setpn());
        Global.table.setBuildInFunction(new setpc());
        Global.table.setBuildInFunction(new pots());
        Global.table.setBuildInFunction(new erall());
    }

    static initInterpreterObjects() {
        Global.interpreterObjects = new InterpereterObjects();
    }

    static getTable() {
        return Global.table;
    }

    static getInterpreterObjects() {
        return Global.interpreterObjects;
    }
};
