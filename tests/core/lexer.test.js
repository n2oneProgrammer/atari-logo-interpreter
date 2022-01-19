const Lexer = require('../../core/lexer');
const data = require('./data.json');


describe('Lexer', () => {

    it("Initalize", () => {
        let lexer = new Lexer("test", "");
        expect(lexer).toBeDefined();
    });

    it("Correct command", () => {
        let lexer = new Lexer("test", data[0].command);
        let obj = lexer.run();
        expect(obj).toEqual(data[0].lexer);
    })

    it("Correct advance command", () => {
        let lexer = new Lexer("shell", data[1].command);
        let obj = lexer.run();
        expect(obj).toEqual(data[1].lexer);
    })

    it("Incorrect advance command", () => {
        let lexer = new Lexer("shell", data[2].command);
        let obj = lexer.run();
        expect(obj).toEqual(data[2].lexer);
    })

    it("Correct advance command (save/load)", () => {
        let lexer = new Lexer("shell", data[3].command);
        let obj = lexer.run();
        expect(obj).toEqual(data[3].lexer);
    })

    it("Incorrect advance command (save/load)", () => {
        let lexer = new Lexer("shell", data[4].command);
        let obj = lexer.run();
        expect(obj).toEqual(data[4].lexer);
    })
});
