class DrawableLine {

    constructor(x, y, x2, y2, width, color) {
        this.x = x;
        this.y = y;
        this.x2 = x2;
        this.y2 = y2;
        this.width = width;
        this.color = color;
    }

    draw(ctx, centerX, centerY) {
        let x = this.x + centerX;
        let y = this.y + centerY;
        let x2 = this.x2 + centerX;
        let y2 = this.y2 + centerY;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width;
        ctx.stroke();
        ctx.closePath();
    }

}

export default DrawableLine;
