export class Roundedslide {
    private location: number;
    private angleSize: number;
    private angleLoc: number;
    private color;

    constructor(bin_num, bins, color){
        this.location = 2*Math.PI/bin_num;
        this.angleSize = 2*Math.PI/bins;
        this.color = color;
    }

    public draw(centerx, centery, context: CanvasRenderingContext2D, scalar){
        context.moveTo(centerx, centery);
        context.beginPath();
        context.fillStyle = this.color;
        context.arc(centerx, centery, scalar, this.location, this.location+this.angleSize);
        context.lineTo(centerx, centery);
        context.closePath();
        context.fill();
    }
}
