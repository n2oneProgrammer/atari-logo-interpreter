import CanvasManager from "./CanvasManager.js";
import DrawableLine from "./drawableLine.js";

class ScreenManager {
    constructor() {
        this.settings = document.getElementById('settings');

        this.toolbarButtonsNames = ['settings', 'download', 'save', 'upload', 'close-settings'];
        this.terminalNames = ['history', 'logs', 'errors', 'editor'];

        this.toolbarButtons = {};
        this.terminalSections = {};
        this.terminalButtons = {};
        this.commandLine = null;
        this.commandLineButton = null;
        window.logoInterpreter.handleCreateLine(async (event, value) => {
            await CanvasManager.getInstance().addDrawableObject(new DrawableLine(value.x, value.y, value.x2, value.y2, value.width, value.color));
        });
        window.logoInterpreter.handleRefreshCanvas((event) => {
            CanvasManager.getInstance().flushImg()
        });
        window.logoInterpreter.handleRefreshTurtles((event, turtles) => {
            CanvasManager.getInstance().refreshTurtles(turtles)
        });
        window.logoInterpreter.handleClearCanvas(async (event) => {
            await CanvasManager.getInstance().clearCanvas();
        });
        this.init();
    }

    init() {
        this.getHTMLNodes();
        this.setListeners();
        this.terminalSections.history.scrollTop = this.terminalSections.history.scrollHeight;
    }

    getHTMLNodes() {
        this.toolbarButtonsNames.forEach(name => {
            const button = {name, obj: document.getElementById(`bt-${name}`)};
            this.toolbarButtons[name.replaceAll('-', '_')] = button;
        });

        this.terminalNames.forEach(name => {
            const section = {name, obj: document.getElementById(`section-${name}`)};
            const button = {name, obj: document.getElementById(`bt-${name}`)};
            this.terminalSections[name.replaceAll('-', '_')] = section;
            this.terminalButtons[name.replaceAll('-', '_')] = button;
        });
        this.commandLine = document.querySelector("#command_line");
        this.commandLineButton = document.querySelector(".aside__input-confirm");
    }

    setListeners() {
        this.toolbarButtons.settings.obj.addEventListener('click', () => this.show(settings));
        this.toolbarButtons.close_settings.obj.addEventListener('click', () => this.hide(settings));

        this.commandLine.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                this.executeCommand();
            }

        });
        this.commandLineButton.addEventListener("click", () => {
            this.executeCommand();
        });

        Object.values(this.terminalButtons).forEach(({name, obj}) => {
            obj.addEventListener('click', () => {

                Object.values(this.terminalButtons).forEach(({obj}) => {
                    obj.classList.remove('aside__terminal-options-button--active');
                });

                this.terminalButtons[name].obj.classList.add('aside__terminal-options-button--active');
                Object.values(this.terminalSections).forEach(({obj}) => this.hide(obj));
                this.show(this.terminalSections[name].obj, 'flex');
            });
        });
    }

    executeCommand() {
        window.logoInterpreter.execute(this.commandLine.value);
        this.commandLine.value = "";
    }


    hide(elem) {
        elem.style.display = 'none';
    }

    show(elem, type = 'block') {
        elem.style.display = type;
    }
}

export default ScreenManager;
