import ScreenManager from './ScreenManager.js';
import CanvasManager from "./CanvasManager.js";

new class Main {

    constructor() {
        this.screen = new ScreenManager();
        let canvasManager = CanvasManager.getInstance();
    }
};
