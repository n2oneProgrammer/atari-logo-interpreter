const RuntimeResult = require('../utilities/runtimeResult');
const {
    RuntimeError
} = require('../error');

module.exports = class Value {

    constructor() {
        this.setPosition();
        this.setContext();
    }

    setPosition(pos_start = null, pos_end = null) {
        this.pos_start = pos_start;
        this.pos_end = pos_end;
        return this;
    }

    setContext(context = null) {
        this.context = context;
        return this;
    }

    illegalOperation(other = null) {
        if (other === null) {
            other = this;
        }
        return RuntimeError(
            this.pos_start,
            other.pos_end,
            `Illegal operation`,
            this.context
        );
    }

    isNumber() {
        return false;
    }

    copy() {
        throw new Error(`No copy method defined`);
    }

    execute(args) {
        return RuntimeResult().failure(this.illegalOperation());
    }

    add(other) {
        return {
            value: null,
            error: this.illegalOperation(other)
        };
    }

    sub(other) {
        return {
            value: null,
            error: this.illegalOperation(other)
        };
    }

    mul(other) {
        return {
            value: null,
            error: this.illegalOperation(other)
        };
    }

    div(other) {
        return {
            value: null,
            error: this.illegalOperation(other)
        };
    }
}
