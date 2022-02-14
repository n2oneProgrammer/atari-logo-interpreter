class CanvasManager {
    static #instance = null;

    static getInstance() {
        if (CanvasManager.#instance === null) {
            CanvasManager.#instance = new CanvasManager();
        }
        return CanvasManager.#instance;
    }

    constructor() {
        this.canvasContainer = document.querySelector(".canvasContainer");
        this.canvas = document.querySelector(".canvasContainer canvas");
        this.rescalingCanvas();
        this.setListeners();
    }

    rescalingCanvas() {
        let width = this.canvasContainer.clientWidth;
        let height = this.canvasContainer.clientHeight;
        console.log(width, height);
        this.canvas.width = width;
        this.canvas.height = height;
    }

    setListeners() {
        window.addEventListener("resize", () => this.rescalingCanvas())
    }

}

export default CanvasManager;
