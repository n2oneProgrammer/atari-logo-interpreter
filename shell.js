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
        this.execute("CS HT ST PU PD RT 10 LT 10 FD 10 BK 10 SETC 10 SETPN 1 SETPC 1 12 POTS ERALL");
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
