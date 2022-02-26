const {
    BuiltInFunction
} = require("./function");
const RuntimeResult = require("../utilities/runtimeResult");
const {
    RuntimeError
} = require("../error");
const Interface = require("../utilities/interface");

class cs extends BuiltInFunction {

    copy() {
        return super.copy(cs);
    }

    execute(args) {
        return super._execute(args, [], (context) => {
            Interface.clear();

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
            if (v < 0 || v > 127) {
                return new RuntimeResult().failure(
                    new RuntimeError(this.pos_start, this.pos_end, "Color value must be between 0 and 127", context)
                );
            }
            for (let i = 0; i < ids.length; i++) {
                this.objcts.getTurtle(ids[i]).setcolor(v);
            }
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
            const ids = context.symbolTable.get("$who").data;
            const v = context.symbolTable.get("id").value;
            if (v < 0 || v > 2) {
                return new RuntimeResult().failure(
                    new RuntimeError(this.pos_start, this.pos_end, "You only have pens with id 0,1,2 available. (Buy a premum to unlock more pens 😉)", context)
                );
            }
            for (let i = 0; i < ids.length; i++) {
                this.objcts.getTurtle(ids[i]).setpen(v);
            }
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
            const v = context.symbolTable.get("id").value;
            const c = context.symbolTable.get("color").value;
            if (v < 0 || v > 2) {
                return new RuntimeResult().failure(
                    new RuntimeError(this.pos_start, this.pos_end, "You only have pens with id 0,1,2 available. (Buy a premum to unlock more pens 😉)", context)
                );
            }
            if (c < 0 || c > 127) {
                return new RuntimeResult().failure(
                    new RuntimeError(this.pos_start, this.pos_end, "Color value must be between 0 and 127", context)
                );
            }
            this.objcts.getPen(v).setColor(c);
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
            const funcs = context.symbolTable.getAllFunc();
            let txt = "";
            for (let i = 0; i < funcs.length; i++) {
                if (funcs[i].text !== undefined) {
                    const args = (funcs[i].argNames.map((e) => ":" + e).join(" "));
                    txt += `${funcs[i].name} ${args}\n`;
                }
            }
            if (txt === "") {
                txt = "No functions found.\n";
            }
            Interface.print(txt);

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
            const funcs = context.symbolTable.getAllFunc();

            for (let i = 0; i < funcs.length; i++) {
                if (funcs[i].text !== undefined) {
                    context.symbolTable.remove(funcs[i].name);
                }
            }

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
};
