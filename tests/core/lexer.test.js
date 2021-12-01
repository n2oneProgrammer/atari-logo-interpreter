import Lexer from '../../core/lexer';

describe('Lexer', () => {

    it("Initalize", () => {
        const commands = ""
        let lexer = new Lexer("test", commands);
        expect(lexer).toBeDefined();
    });

    it("Test on 1 command", () => {
        const commands = "4+4"
        const tokens = [{
                type: 'NUMBER',
                value: '4',
                pos_start: {
                    id: 0,
                    line: 0,
                    column: 0,
                    fn: 'test',
                    ftext: '4+4'
                },
                pos_end: {
                    id: 1,
                    line: 0,
                    column: 1,
                    fn: 'test',
                    ftext: '4+4'
                }
            },
            {
                type: 'PLUS',
                value: null,
                pos_start: {
                    id: 1,
                    line: 0,
                    column: 1,
                    fn: 'test',
                    ftext: '4+4'
                },
                pos_end: {
                    id: 2,
                    line: 0,
                    column: 2,
                    fn: 'test',
                    ftext: '4+4'
                }
            },
            {
                type: 'NUMBER',
                value: '4',
                pos_start: {
                    id: 2,
                    line: 0,
                    column: 2,
                    fn: 'test',
                    ftext: '4+4'
                },
                pos_end: {
                    id: 3,
                    line: 0,
                    column: 3,
                    fn: 'test',
                    ftext: '4+4'
                }
            },
            {
                type: 'EOF',
                value: null,
                pos_start: {
                    id: 3,
                    line: 0,
                    column: 3,
                    fn: 'test',
                    ftext: '4+4'
                },
                pos_end: {
                    id: 4,
                    line: 0,
                    column: 4,
                    fn: 'test',
                    ftext: '4+4'
                }
            }
        ]
        const error = null

        let lexer = new Lexer("test", commands);
        let obj = lexer.run();
        console.log(obj.tokens[0].pos_start);
        expect(obj.tokens).toEqual(tokens);
        expect(obj.error).toEqual(error);
    })

});
