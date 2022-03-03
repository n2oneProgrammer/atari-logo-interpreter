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
        this.background = document.createElement("canvas");
        this.background.width = 2000;
        this.background.height = 2000;
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
        this.scale = 1;
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

    async addDrawableObject(object) {
        await this.drawOneLine(object);
    }

    async drawOneLine(obj) {
        const ctx = this.background.getContext('2d');
        const centerX = this.background.width / 2;
        const centerY = this.background.height / 2;
        obj.draw(ctx, centerX, centerY);

    }

    async flushImg() {
        const centerX = this.canvas.clientWidth / 2;
        const centerY = this.canvas.clientHeight / 2;
        const ctx = this.canvas.getContext("2d");
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        //Draw background with picture
        let newWidth = this.background.width * this.scale;
        let newHeight = this.background.height * this.scale;
        ctx.drawImage(this.background, -newWidth / 2 + this.canvas.width / 2, -newHeight / 2 + this.canvas.height / 2, newWidth, newHeight);
        //Draw turtles
        this.turtles.forEach(turtle => {
            let width = 30;
            let height = width * this.turtleImageShell.naturalHeight / this.turtleImageShell.naturalWidth;
            ctx.drawImage(turtle.turtle, centerX + turtle.x * this.scale - width / 2, centerY + turtle.y * this.scale - height / 2);
        })
    }

    drawTurtle(width, height, rotation, color) {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        //Set rotation for next images
        ctx.translate(width * 0.5, height * 0.5);
        ctx.rotate(rotation * Math.PI / 180);
        ctx.translate(-width * 0.5, -height * 0.5);

        //draw changeable color shell
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, width, height);

        ctx.globalCompositeOperation = "destination-in";
        ctx.drawImage(this.turtleImageShell, 0, 0, width, height);
        //Draw contour of turtle
        ctx.globalCompositeOperation = "source-over";
        ctx.drawImage(this.turtleImageContours, 0, 0, width, height);
        return canvas;
    }

    refreshTurtles(turtles) {
        this.turtles = turtles.filter(turtle => turtle.visible).map(turtle => {
            let width = 30;
            let height = width * this.turtleImageShell.naturalHeight / this.turtleImageShell.naturalWidth;
            return {
                turtle: this.drawTurtle(width, height, turtle.rotation, turtle.color),
                x: turtle.x,
                y: turtle.y
            };
        });
        this.flushImg();
    }

    async clearCanvas() {
        const ctx = this.background.getContext('2d');
        ctx.clearRect(0, 0, this.background.width, this.background.height);
        this.turtles = [];
        let turtles = await window.logoInterpreter.getTurtles();
        this.refreshTurtles(turtles);
    }

    setListeners() {
        window.addEventListener("resize", () => {
            this.rescalingCanvas();
            new Promise(() => this.flushImg());
        });

        this.canvas.addEventListener("wheel", (e) => {
            e.preventDefault();
            this.scale += e.deltaY * -0.001;
            this.scale = Math.min(Math.max(.125, this.scale), 10);

            new Promise(() => this.flushImg());
        });
    }

}

export default CanvasManager;
