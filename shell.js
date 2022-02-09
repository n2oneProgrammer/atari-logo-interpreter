const prompt = require('prompt');
const Runner = require('./core/runner.js');

class Shell {
    constructor() {
        prompt.start();
        this.run = new Runner("shell");
        this.shell();
    }

    shell() {
        //TODO: Remove debug
        this.execute("LOAD C:\\Data\\a");
        return;
        prompt.get(['cmd'], (err, result) => {
            this.execute(result.cmd);
            this.shell();
        });
    }

    execute(command) {
        const result = this.run.start(command)
        console.log(result);
    }
}

new Shell();
