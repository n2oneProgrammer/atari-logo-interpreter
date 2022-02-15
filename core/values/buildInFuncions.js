const {
    BuiltInFunction
} = require("./function");
const RuntimeResult = require("../utilities/runtimeResult");

class cs extends BuiltInFunction {

    copy() {
        return super.copy(cs);
    }

    execute(args) {
        return super._execute(args, [], (context) => {
            // TODO: cs

            return new RuntimeResult().success(null);
        });
    }
}

class ht extends BuiltInFunction {

    copy() {
        return super.copy(ht);
    }

    execute(args) {
        return super._execute(args, [], (context) => {
            const ids = context.symbolTable.get("$who").data;
            for (let i = 0; i < ids.length; i++) {
                this.objcts.getTurtle(ids[i]).hide();
            }
            return new RuntimeResult().success(null);
        });
    }
}

class st extends BuiltInFunction {

    copy() {
        return super.copy(st);
    }

    execute(args) {
        return super._execute(args, [], (context) => {
            const ids = context.symbolTable.get("$who").data;
            for (let i = 0; i < ids.length; i++) {
                this.objcts.getTurtle(ids[i]).show();
            }
            return new RuntimeResult().success(null);
        });
    }
}

class pu extends BuiltInFunction {

    copy() {
        return super.copy(pu);
    }

    execute(args) {
        return super._execute(args, [], (context) => {
            const ids = context.symbolTable.get("$who").data;
            for (let i = 0; i < ids.length; i++) {
                this.objcts.getTurtle(ids[i]).penup();
            }
            return new RuntimeResult().success(null);
        });
    }
}

class pd extends BuiltInFunction {

    copy() {
        return super.copy(pd);
    }

    execute(args) {
        return super._execute(args, [], (context) => {
            const ids = context.symbolTable.get("$who").data;
            for (let i = 0; i < ids.length; i++) {
                this.objcts.getTurtle(ids[i]).pendown();
            }
            return new RuntimeResult().success(null);
        });
    }
}

class rt extends BuiltInFunction {

    copy() {
        return super.copy(rt);
    }

    execute(args) {
        return super._execute(args, ["v"], (context) => {
            const ids = context.symbolTable.get("$who").data;
            const v = context.symbolTable.get("v").value;
            for (let i = 0; i < ids.length; i++) {
                this.objcts.getTurtle(ids[i]).right(v);
            }
            return new RuntimeResult().success(null);
        });
    }
}

class lt extends BuiltInFunction {

    copy() {
        return super.copy(lt);
    }

    execute(args) {
        return super._execute(args, ["v"], (context) => {
            const ids = context.symbolTable.get("$who").data;
            const v = context.symbolTable.get("v").value;
            for (let i = 0; i < ids.length; i++) {
                this.objcts.getTurtle(ids[i]).left(v);
            }
            return new RuntimeResult().success(null);
        });
    }
}

class fd extends BuiltInFunction {

    copy() {
        return super.copy(fd);
    }

    execute(args) {
        return super._execute(args, ["v"], (context) => {
            const ids = context.symbolTable.get("$who").data;
            const v = context.symbolTable.get("v").value;
            for (let i = 0; i < ids.length; i++) {
                this.objcts.getTurtle(ids[i]).forward(v);
            }
            return new RuntimeResult().success(null);
        });
    }
}

class bk extends BuiltInFunction {

    copy() {
        return super.copy(bk);
    }

    execute(args) {
        return super._execute(args, ["v"], (context) => {
            const ids = context.symbolTable.get("$who").data;
            const v = context.symbolTable.get("v").value;
            for (let i = 0; i < ids.length; i++) {
                this.objcts.getTurtle(ids[i]).backward(v);
            }
            return new RuntimeResult().success(null);
        });
    }
}

class setc extends BuiltInFunction {

    copy() {
        return super.copy(setc);
    }

    execute(args) {
        return super._execute(args, ["color"], (context) => {
            const ids = context.symbolTable.get("$who").data;
            const v = context.symbolTable.get("color").value;

        });
    }

    execute(args) {
        return super._execute(args, ["color"], (context) => {
            // TODO: setc

            return new RuntimeResult().success(null);
        });
    }
}

class setpn extends BuiltInFunction {

    copy() {
        return super.copy(setpn);
    }

    execute(args) {
        return super._execute(args, ["id"], (context) => {
            // TODO: setpn

            return new RuntimeResult().success(null);
        });
    }
}

class setpc extends BuiltInFunction {

    copy() {
        return super.copy(setpc);
    }

    execute(args) {
        return super._execute(args, ["id", "color"], (context) => {
            // TODO: setpc

            return new RuntimeResult().success(null);
        });
    }
}


class pots extends BuiltInFunction {

    copy() {
        return super.copy(pots);
    }

    execute(args) {
        return super._execute(args, [], (context) => {
            // TODO: pots

            return new RuntimeResult().success(null);
        });
    }
}

class erall extends BuiltInFunction {

    copy() {
        return super.copy(erall);
    }

    execute(args) {
        return super._execute(args, [], (context) => {
            // TODO: erall

            return new RuntimeResult().success(null);
        });
    }
}

module.exports = {
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
}
