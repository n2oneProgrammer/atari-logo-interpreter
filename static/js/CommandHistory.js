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
        this.DOMcommandHistory = document.querySelector(".aside__history-commands");
    }

    addCommand(command) {
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

    }


}
