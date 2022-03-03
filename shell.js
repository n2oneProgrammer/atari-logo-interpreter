const Runner = require('./core/runner.js');

class Shell {
    constructor() {
        prompt.start();
        this.run = new Runner("shell");
        this.shell();
    }

    shell() {
        //TODO: Remove debug
        //this.execute("TO func :x :y TO run :aa CS END END func 1 0");
        this.execute("TO func :x :y CS END TO run TO func2 :aaa CS END CS HT ST PU PD RT 10 LT 10 FD 10 BK 10 SETC 10 SETPN 2 SETPC 1 12 POTS ERALL END run");
        return;
    }

    execute(command) {
        const result = this.run.start(command)
        console.log(result);
    }
}

new Shell();
