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
        this.background = document.createElement("canvas");
        this.drawableObjects = [];
        this.turtles = [];
        this.turtleImageShell = new Image(50);
        this.turtleImageShell.src = "../img/turtleShell.png";
        this.turtleImageShell.onload = async () => {
            let turtles = await window.logoInterpreter.getTurtles();
            this.refreshTurtles(turtles);
        };
        this.turtleImageContours = new Image(50);
        this.turtleImageContours.src = "../img/turtleContours.png";
        this.turtleImageContours.onload = async () => {
            let turtles = await window.logoInterpreter.getTurtles();
            this.refreshTurtles(turtles);
        };
        this.rescalingCanvas();
        this.setListeners();
    }

    rescalingCanvas() {
        let width = this.canvasContainer.clientWidth;
        let height = this.canvasContainer.clientHeight;
        console.log(width, height);
        const xscale = this.canvasContainer.clientWidth / this.canvas.width;
        const yscale = this.canvasContainer.clientHeight / this.canvas.height;
        this.centerX *= xscale;
        this.centerY *= yscale;
        console.log(this.background);
        this.canvas.width = width;
        this.canvas.height = height;
        this.background.width = width;
        this.background.height = height;
    }

    async addDrawableObject(object) {
        this.drawableObjects.push(object);
        await this.drawOneLine(object);
    }

    drawAll() {
        const ctx = this.background.getContext('2d');
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const centerX = this.canvas.clientWidth / 2;
        const centerY = this.canvas.clientHeight / 2;
        this.drawableObjects.forEach(el => el.draw(ctx, centerX, centerY, this.scale));
        this.flushImg();
    }

    async drawOneLine(obj) {
        const ctx = this.background.getContext('2d');
        const centerX = this.canvas.clientWidth / 2;
        const centerY = this.canvas.clientHeight / 2;
        obj.draw(ctx, centerX, centerY, this.scale);

    }

    async flushImg() {
        const centerX = this.canvas.clientWidth / 2;
        const centerY = this.canvas.clientHeight / 2;
        const ctx = this.canvas.getContext("2d");
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.drawImage(this.background, 0, 0);
        this.turtles.forEach(turtle => {
            let width = 20;
            let height = width * this.turtleImageShell.naturalHeight / this.turtleImageShell.naturalWidth;
            ctx.drawImage(turtle.turtle, centerX + turtle.x - width / 2, centerY + turtle.y - height / 2);
        })
    }

    drawTurtle(width, height, rotation, color) {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        ctx.translate(width * 0.5, height * 0.5);
        ctx.rotate(rotation * Math.PI / 180);
        ctx.translate(-width * 0.5, -height * 0.5);

        ctx.fillStyle = color;
        ctx.fillRect(0, 0, width, height);

        ctx.globalCompositeOperation = "destination-in";
        ctx.drawImage(this.turtleImageShell, 0, 0, width, height);

        ctx.globalCompositeOperation = "source-over";
        ctx.drawImage(this.turtleImageContours, 0, 0, width, height);
        return canvas;
    }

    refreshTurtles(turtles) {
        this.turtles = turtles.map(turtle => {
            console.log(turtle);
            let width = 20;
            let height = width * this.turtleImageShell.naturalHeight / this.turtleImageShell.naturalWidth;
            return {
                turtle: this.drawTurtle(width, height, turtle.rotation, turtle.color),
                x: turtle.x,
                y: turtle.y
            };
        });
        this.flushImg();
        console.log(this.turtles);
    }


    setListeners() {
        window.addEventListener("resize", () => {
            this.rescalingCanvas();
            new Promise(() => this.drawAll());
        });
        this.canvas.addEventListener("wheel", (e) => {
            e.preventDefault();
            this.scale += e.deltaY * -0.001;
            this.scale = Math.min(Math.max(.125, this.scale), 10);
            new Promise(() => this.drawAll());
        });
    }

}

export default CanvasManager;
