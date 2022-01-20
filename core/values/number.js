const {
    RuntimeError
} = require('../error');
const Value = require('./value');

module.exports = class Number extends Value {

    constructor(value) {
        super();
        this.value = value;
    }

    copy() {
        let copy = Number(this.value);
        copy.setPosition(this.pos_start, this.pos_end);
        copy.setContext(this.context);
        return copy;
    }

    add(other) {
        if (other instanceof Number) {
            return {
                value: new Number(this.value + other.value),
                error: null
            };
        }
        return {
            value: null,
            error: Value.illegalOperation(other)
        };
    }

    sub(other) {
        if (other instanceof Number) {
            return {
                value: new Number(this.value - other.value),
                error: null
            };
        }
        return {
            value: null,
            error: Value.illegalOperation(other)
        };
    }

    mul(other) {
        if (other instanceof Number) {
            return {
                value: new Number(this.value * other.value),
                error: null
            };
        }
        return {
            value: null,
            error: Value.illegalOperation(other)
        };
    }

    div(other) {
        if (other instanceof Number) {
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
                value: new Number(this.value / other.value),
                error: null
            };
        }
        return {
            value: null,
            error: Value.illegalOperation(other)
        };
    }

}
