export class ConsoleOutput {
    static #instance = null;

    static getInstance() {
        if (ConsoleOutput.#instance === null) {
            ConsoleOutput.#instance = new ConsoleOutput();
        }
        return ConsoleOutput.#instance;
    }

    constructor() {
        this.lines = [];
        this.DOMconsolelines = document.querySelector(".aside__logs-logs");
    }

    addLine(linesText, type) {
        linesText = linesText.replaceAll("  ", "&nbsp;&nbsp;");
        linesText = linesText.replaceAll("\n", "<br/>");
        this.lines.push({text: linesText, type: type});
        this.refreshConsoleLines();
    }


    refreshConsoleLines() {
        this.DOMconsolelines.innerHTML = "";
        this.lines.forEach(line => {
            let element = document.createElement("p");

            element.innerHTML = line.text;
            if (line.type === "ERROR") {
                element.classList.add("aside__log--error");
            } else {
                element.classList.add("aside__log--log");
            }

            this.DOMconsolelines.appendChild(element);
        });

    }


}
