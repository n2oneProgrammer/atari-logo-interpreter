import {ConsoleOutput} from "./ConsoleOutput.js";

export class CommandHistory {
    static #instance = null;

    static getInstance() {
        if (CommandHistory.#instance === null) {
            CommandHistory.#instance = new CommandHistory();
        }
        return CommandHistory.#instance;
    }

    constructor() {
        this.commands = [];
        this.selected_command = -1;
        this.save_input = "";
        this.DOMcommandHistory = document.querySelector(".aside__history-commands");
        this.DOMcommandHistoryContainer = document.querySelector(".aside__history");
        this.DOMconsoleContainer = document.querySelector(".aside__logs");
    }

    addCommand(command) {
        ConsoleOutput.getInstance().addLine(command, "NORMAL");
        this.commands.push(command);
        this.refreshCommandList();
    }

    refreshCommandList() {
        this.DOMcommandHistory.innerHTML = "";
        this.commands.forEach(comm => {
            let element = document.createElement("p");
            element.classList.add("aside__log");
            element.innerText = comm;
            this.DOMcommandHistory.appendChild(element);
        });
        this.DOMcommandHistoryContainer.scrollTop = this.DOMcommandHistoryContainer.scrollHeight;
        this.DOMconsoleContainer.scrollTop = this.DOMconsoleContainer.scrollHeight;
    }

    goUp(value) {
        if (this.commands.length === 0) {
            return "";
        }
        console.log(this.save_input);
        if (this.selected_command === -1) {
            this.save_input = value;

            this.selected_command = this.commands.length;
        }
        if (this.selected_command > 0) {
            this.selected_command--;
        }
        return this.commands[this.selected_command];
    }

    goDown() {
        if (this.selected_command === -1) {
            return this.save_input;
        }
        if (this.selected_command < this.commands.length-1) {
            this.selected_command++;
        }else {
            this.selected_command = -1;
            return this.save_input;
        }
        console.log(this.selected_command);
        return this.commands[this.selected_command];
    }

    reset(value) {
        this.save_input = value;
        this.selected_command = -1;
    }

}
