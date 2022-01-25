const {
    RuntimeError
} = require('../error');
const Value = require('./value');

module.exports = class NumberValue extends Value {

    constructor(value) {
        super();
        this.value = value;
    }

    copy() {
        let copy = new NumberValue(this.value);
        copy.setPosition(this.pos_start, this.pos_end);
        copy.setContext(this.context);
        return copy;
    }

    add(other) {
        if (other instanceof NumberValue) {
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
        if (other instanceof NumberValue) {
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
        if (other instanceof NumberValue) {
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
        if (other instanceof NumberValue) {
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
