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
        console.log(window.logoInterpreter);
        window.logoInterpreter.handleCreateLine((event, value) => {
            console.log(value);
            console.log(CanvasManager.getInstance());
            CanvasManager.getInstance().addDrawableObject(new DrawableLine(value.x, value.y, value.x2, value.y2, value.width, value.color));
            console.log(CanvasManager.getInstance());
        });
        window.logoInterpreter.execute("TO func :x :y CS END TO run TO func2 :aaa CS END CS HT ST PU PD RT 10 LT 10 FD 10 BK 10 SETC 10 SETPN 2 SETPC 1 12 POTS ERALL END run");
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
    }

    setListeners() {
        this.toolbarButtons.settings.obj.addEventListener('click', () => this.show(settings));
        this.toolbarButtons.close_settings.obj.addEventListener('click', () => this.hide(settings));

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

    hide(elem) {
        elem.style.display = 'none';
    }

    show(elem, type = 'block') {
        elem.style.display = type;
    }
}

export default ScreenManager;
