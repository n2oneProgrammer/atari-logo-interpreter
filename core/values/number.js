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

    toString() {
        return `[${this.value}]`;
    }

    isNumber() {
        return true;
    }

    add(other) {
        if (this.isNumber()) {
            return {
                value: new NumberValue(this.value + other.value).setContext(this.context).setPosition(this.pos_start, other.pos_end),
                error: null
            };
        }
        return {
            value: null,
            error: this.illegalOperation(other)
        };
    }

    sub(other) {
        if (this.isNumber()) {
            return {
                value: new NumberValue(this.value - other.value).setContext(this.context).setPosition(this.pos_start, other.pos_end),
                error: null
            };
        }
        return {
            value: null,
            error: this.illegalOperation(other)
        };
    }

    mul(other) {
        if (this.isNumber()) {
            return {
                value: new NumberValue(this.value * other.value).setContext(this.context).setPosition(this.pos_start, other.pos_end),
                error: null
            };
        }
        return {
            value: null,
            error: this.illegalOperation(other)
        };
    }

    div(other) {
        if (this.isNumber()) {
            if (other.value === 0) {
                return {
                    value: null,
                    error: new RuntimeError(
                        this.pos_start,
                        other.pos_end,
                        `Division by zero`,
                        this.context
                    )
                };
            }
            return {
                value: new NumberValue(Math.floor(this.value / other.value)).setContext(this.context).setPosition(this.pos_start, other.pos_end),
                error: null
            };
        }
        return {
            value: null,
            error: this.illegalOperation(other)
        };
    }

}
