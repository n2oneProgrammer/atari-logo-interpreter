import prompt from 'prompt';
import Runner from './core/runner.js';

class Shell {
    constructor() {
        prompt.start();
        this.run = new Runner("shell");
        this.shell();
    }

    shell() {
        this.execute("TO func :xd :cos RT :xd FW 100 LR FW 100 END")
        return
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
