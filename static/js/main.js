import ScreenManager from './ScreenManager.js';
import CanvasManager from "./CanvasManager.js";
import ProcedureEditor from "./ProcedureEditor.js";

new class Main {
    constructor() {
        this.screen = new ScreenManager();
        const canvasManager = CanvasManager.getInstance();
        const procedureEditor = ProcedureEditor.getInstance();
    }
};
