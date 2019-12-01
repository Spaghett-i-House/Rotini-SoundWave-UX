/**
 * The base class for any visualizer to be used
 */
export class Basevisualizer {
    protected canvas: HTMLCanvasElement;
    protected running: boolean;
    protected audioData: Map<number, number>;
    protected drawCycle: any; // the interval that the
    protected colors: Array<string> = ["#000000", "#ffffff"];
    protected resolution: number;

    constructor(canvas: HTMLCanvasElement){
        this.canvas = canvas;
        this.audioData = new Map<number, number>();
    }

    public setColors(colors: Array<string>){
        this.colors = colors;
    }

    public destroy(){
        clearInterval(this.drawCycle);
        this.running = false;
    }

    public setAudioData(audioData: any){
        this.audioData = audioData;
    }

    public setResolution(resolution){
        this.resolution = resolution;
    }

    public start(){
        this.running = true;
        let render = (now) => {
            now += .001;
            this.visualize()
            if(this.running){
                requestAnimationFrame(render);
            }
        }
        requestAnimationFrame(render);
    }

    public stop(){
        clearInterval(this.drawCycle);
        this.running = false;
    }

    protected visualize(){
        console.log("No visualization, base visualizer");
    }
}
