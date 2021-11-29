import prompt from 'prompt';
import Run from './core/run.js';

class Shell {
    constructor() {
        prompt.start();
        this.shell();
        this.run = new Run("shell");
    }

    shell() {
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

new Shell(null);
