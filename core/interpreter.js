const {
    RuntimeError
} = require('./error');
const Token = require('./token');
const {
    FunctionValue
} = require('./values/function');
const NumberValue = require('./values/number');
const RuntimeResult = require('./utilities/runtimeResult');

module.exports = class Interpeter {
    visit(node, context) {
        let func = this[`visit ${node.constructor.name}`];
        if (func) {

        } else {
            this.no_visit_method_error(node, context);
        }
    }

    no_visit_method_error(node, context) {
        throw new Error(`No visit method for ${node.constructor.name}`);
    }
}
