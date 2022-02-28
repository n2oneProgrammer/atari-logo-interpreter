export class ErrorsTab {
    static #instance = null;

    static getInstance() {
        if (ErrorsTab.#instance === null) {
            ErrorsTab.#instance = new ErrorsTab();
        }
        return ErrorsTab.#instance;
    }

    constructor() {
        this.errors = [];
        this.DOMerrors = document.querySelector(".aside__logs-errors");
    }

    addError(errorMsg) {
        console.log(errorMsg);
        errorMsg = errorMsg.replaceAll(" ", "&nbsp;");
        errorMsg = errorMsg.replaceAll("\n", "<br/>");
        this.errors.push(errorMsg);
        this.refreshErrorList();
    }

    refreshErrorList() {
        this.DOMerrors.innerHTML = "";
        this.errors.forEach(err => {
            let element = document.createElement("p");
            element.classList.add("aside__log--error");
            element.innerHTML = err;
            this.DOMerrors.appendChild(element);
        });

    }


}
