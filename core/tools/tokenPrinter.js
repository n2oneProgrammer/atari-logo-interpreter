const Token = require("../token.js");

module.exports = class TokenPrinter {
    static toString(tokens) {
        let str = "";
        for (let i = 0; i < tokens.length; i++) {
            const element = tokens[i];
            if (
                element.type === Token.TYPE.IDENTIFIER ||
                element.type === Token.TYPE.PATH ||
                element.type === Token.TYPE.KEYWORD
            )
                str += `[${element.type}:${element.value}] `;
            else str += `[${element.type}] `;
        }
        return str;
    }
};
