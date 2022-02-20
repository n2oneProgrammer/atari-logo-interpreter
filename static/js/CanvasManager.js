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
        this.centerX = this.canvas.clientWidth / 2;
        this.centerY = this.canvas.clientHeight / 2;
        this.scale = 1;
        this.rescalingCanvas();
        this.drawableObjects = [];
        this.setListeners();

        this.draw()
    }

    rescalingCanvas() {
        let width = this.canvasContainer.clientWidth;
        let height = this.canvasContainer.clientHeight;
        console.log(width, height);
        const xscale = this.canvasContainer.clientWidth / this.canvas.width;
        const yscale = this.canvasContainer.clientHeight / this.canvas.height;
        this.centerX *= xscale;
        this.centerY *= yscale;

        this.canvas.width = width;
        this.canvas.height = height;
    }

    addDrawableObject(object) {
        this.drawableObjects.push(object);
    }

    draw() {
        const ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const centerX = this.canvas.clientWidth / 2;
        const centerY = this.canvas.clientHeight / 2;
        this.drawableObjects.forEach(el => el.draw(ctx, centerX, centerY, this.scale));
    }

    setListeners() {
        window.addEventListener("resize", () => {
            this.rescalingCanvas();
            this.draw();
        });
        this.canvas.addEventListener("wheel", (e) => {
            e.preventDefault();
            this.scale += e.deltaY * -0.001;
            this.scale = Math.min(Math.max(.125, this.scale), 10);
            this.draw()
        });
    }

}

export default CanvasManager;
