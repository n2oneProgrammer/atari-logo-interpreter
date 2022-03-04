import CanvasManager from "./CanvasManager.js";
import DrawableLine from "./drawableLine.js";
import {CommandHistory} from "./CommandHistory.js";
import {ConsoleOutput} from "./ConsoleOutput.js";
import ProcedureEditor from "./ProcedureEditor.js";

class ScreenManager {
    constructor() {
        this.settings = document.getElementById('settings');
        this.pin = document.getElementById('bt-pin');
        this.bar = document.getElementById('bar');
        this.pin.addEventListener('click', () => {
            this.bar.classList.toggle('tb');
            this.pin.classList.toggle('o');
        });

        this.toolbarButtonsNames = ['settings', 'download', 'save', 'upload', 'close-settings'];
        this.terminalNames = ['history', 'logs', 'editor', 'multiline'];

        this.toolbarButtons = {};
        this.terminalSections = {};
        this.terminalButtons = {};
        this.commandLine = null;
        this.commandLineButton = null;
        this.isMultiline = false;
        this.init();
    }

    init() {
        this.getHTMLNodes();
        this.setListeners();
        this.setHandlers();
        this.terminalSections.history.scrollTop = this.terminalSections.history.scrollHeight;
    }

    setHandlers() {
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
        window.logoInterpreter.handleAddError((event, value) => {
            ConsoleOutput.getInstance().addLine(value, "ERROR");
        });
        window.logoInterpreter.handleAddOutput((event, value) => {
            ConsoleOutput.getInstance().addLine(value, "NORMAL");
        });
        window.logoInterpreter.handleEditProcedure((event, value) => {
            const { name, agrNames, body, node, context } = value;
            ProcedureEditor.getInstance().setProcedure(name, agrNames, body, node, context);
        });
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
        this.multiCommandLine = document.querySelector(".aside__multiline-multiline");
        this.commandLineButton = document.querySelector(".aside__input-confirm");
    }

    setListeners() {
        this.toolbarButtons.settings.obj.addEventListener('click', () => this.show(settings));
        this.toolbarButtons.download.obj.addEventListener('click', () => CanvasManager.getInstance().saveCanvas());
        this.toolbarButtons.save.obj.addEventListener('click', () => window.logoInterpreter.openSaveProcedureDialog());
        this.toolbarButtons.upload.obj.addEventListener('click', () => window.logoInterpreter.openLoadProcedureDialog());
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

                if (name === "multiline") {
                    this.commandLineButton.classList.add("multiline-button");
                    this.commandLine.style.display = "none";
                    if (!this.isMultiline) {
                        this.multiCommandLine.value = "";
                    }
                    this.isMultiline = true;
                } else {
                    this.commandLine.style.display = "block";
                    this.commandLineButton.classList.remove("multiline-button");
                    this.isMultiline = false;
                }

                this.show(this.terminalSections[name].obj, 'flex');
            });
        });
    }

    executeCommand() {

        let command = this.commandLine.value;
        if (this.isMultiline) {
            command = this.multiCommandLine.value;
        }
        CommandHistory.getInstance().addCommand(command);
        window.logoInterpreter.execute(command);
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
