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
        this.execute("TO func :xd :cos RT :xd FW 100 LR FW 100 END SAVE /a");
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
