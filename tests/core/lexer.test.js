import Lexer from '../../core/lexer';
import * as data from './data.json';


describe('Lexer', () => {

    it("Initalize", () => {
        let lexer = new Lexer("test", "");
        expect(lexer).toBeDefined();
    });

    it("Correct command", () => {
        let lexer = new Lexer("test", data.default[0].command);
        let obj = lexer.run();
        expect(obj).toEqual(data.default[0].lexer);
    })

    it("Correct advance command", () => {
        let lexer = new Lexer("shell", data.default[1].command);
        let obj = lexer.run();
        expect(obj).toEqual(data.default[1].lexer);
    })

    it("Incorrect advance command", () => {
        let lexer = new Lexer("shell", data.default[2].command);
        let obj = lexer.run();
        expect(obj).toEqual(data.default[2].lexer);
    })

});
