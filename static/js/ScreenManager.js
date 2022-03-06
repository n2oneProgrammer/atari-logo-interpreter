import CanvasManager from "./CanvasManager.js";
import DrawableLine from "./drawableLine.js";
import {CommandHistory} from "./CommandHistory.js";
import {ConsoleOutput} from "./ConsoleOutput.js";
import ProcedureEditor from "./ProcedureEditor.js";
import Popup from "./Popup.js";

class ScreenManager {
    constructor() {
        this.settings = document.getElementById('settings');
        this.help = document.getElementById('section-help');
        this.pin = document.getElementById('bt-pin');
        this.bar = document.getElementById('bar');
        this.pin.addEventListener('click', () => {
            this.bar.classList.toggle('tb');
            this.pin.classList.toggle('o');
        });

        this.toolbarButtonsNames = ['settings', 'download', 'save', 'upload', 'close-settings', 'close-help'];
        this.terminalNames = ['history', 'logs', 'editor', 'multiline', 'help'];

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
        console.log(this.terminalButtons);
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
            this.terminalButtons.logs.obj.click();
            ConsoleOutput.getInstance().addLine(value, "ERROR");
        });
        window.logoInterpreter.handleAddOutput((event, value) => {
            this.terminalButtons.logs.obj.click();
            ConsoleOutput.getInstance().addLine(value, "NORMAL");
        });
        window.logoInterpreter.handleShowPopup((event, value) => {
            Popup.show(value.message);
        });
        window.logoInterpreter.handleEditProcedure((event, value) => {
            this.terminalButtons.editor.obj.click();
            const {name, agrNames, body, node, context} = value;
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
        this.toolbarButtons.settings.obj.addEventListener('click', () => this.show(this.settings));
        this.terminalButtons.help.obj.addEventListener('click', () => this.show(this.help));
        this.toolbarButtons.download.obj.addEventListener('click', () => CanvasManager.getInstance().saveCanvas());
        this.toolbarButtons.close_settings.obj.addEventListener('click', () => this.hide(this.settings));
        this.toolbarButtons.save.obj.addEventListener('click', () => window.logoInterpreter.openSaveProcedureDialog());
        this.toolbarButtons.upload.obj.addEventListener('click', () => window.logoInterpreter.openLoadProcedureDialog());
        this.toolbarButtons.close_help.obj.addEventListener('click', () => {
            this.hide(this.help);
            Object.values(this.terminalButtons).forEach(({obj}) => {
                obj.classList.remove('aside__terminal-options-button--active');
            });
            this.terminalButtons['logs'].obj.classList.add('aside__terminal-options-button--active');
            Object.values(this.terminalSections).forEach(({obj}) => this.hide(obj));
        });
        this.multiCommandLine.addEventListener("keydown", (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                let start = e.target.selectionStart;
                let end = e.target.selectionEnd;

                e.target.value = e.target.value.substring(0, start) +
                    "\t" + e.target.value.substring(end);

                e.target.selectionStart =
                    e.target.selectionEnd = start + 1;
            }
        });

        this.commandLine.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                this.executeCommand();
            } else if (e.key === "ArrowUp") {
                console.log(this.commandLine.value);
                this.commandLine.value = CommandHistory.getInstance().goUp(this.commandLine.value);
                console.log("UP");
            } else if (e.key === "ArrowDown") {
                console.log("DOWN");
                this.commandLine.value = CommandHistory.getInstance().goDown();
            } else {
                CommandHistory.getInstance().reset(this.commandLine.value);
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
                if (name === 'editor')
                    ProcedureEditor.getInstance().reloadProcedures();
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
