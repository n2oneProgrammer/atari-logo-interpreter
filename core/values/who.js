const {
    RuntimeError
} = require('../error');
const Value = require('./value');
const NumberValue = require('./number');

module.exports = class WhoValue extends Value {

    constructor(data) {
        super();
        this.data = data;
        this.value = data[0];
    }

    copy() {
        let copy = new WhoValue(this.data);
        copy.setPosition(this.pos_start, this.pos_end);
        copy.setContext(this.context);
        return copy;
    }

    isNumber() {
        return this.data.length === 1;
    }

    add(other) {
        if (this.isNumber()) {
            return {
                value: new NumberValue(this.value + other.value),
                error: null
            };
        }
        return {
            value: null,
            error: Value.illegalOperation(other)
        };
    }

    sub(other) {
        if (this.isNumber()) {
            return {
                value: new NumberValue(this.value - other.value),
                error: null
            };
        }
        return {
            value: null,
            error: Value.illegalOperation(other)
        };
    }

    mul(other) {
        if (this.isNumber()) {
            return {
                value: new NumberValue(this.value * other.value),
                error: null
            };
        }
        return {
            value: null,
            error: Value.illegalOperation(other)
        };
    }

    div(other) {
        if (this.isNumber()) {
            if (other.value === 0) {
                return {
                    value: null,
                    error: RuntimeError(
                        this.pos_start,
                        this.pos_end,
                        `Division by zero`,
                        this.context
                    )
                };
            }
            return {
                value: new NumberValue(this.value / other.value),
                error: null
            };
        }
        return {
            value: null,
            error: Value.illegalOperation(other)
        };
    }

}
