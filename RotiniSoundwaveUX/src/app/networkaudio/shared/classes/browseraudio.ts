import {AudioType} from '../model/types';
declare var MediaRecorder: any;

export class Browseraudio {
    /**
     * Browseraudio: a class to ease the analysis of and use of audio data
     */

    private audioContext: AudioContext;
    private streamDestination: AudioDestinationNode;
    public analyser: AnalyserNode;
    public mediaRecorder: any;
    public audioFreqDomain: Uint8Array;

    constructor(){
        this.audioContext = new AudioContext();
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.connect(this.audioContext.destination);
        this.audioFreqDomain = new Uint8Array(this.analyser.fftSize);
        setTimeout(() => {
            this.analyser.getByteFrequencyData(this.audioFreqDomain);
        }, 1000)
        //this.streamDestination = new AudioDestinationNode();
        //this.streamDestination.connect(this.audioContext.destination);
    }

    public setAudioBytes(audioBytesArray: ArrayBuffer, audioDataType: AudioType, channels: number){
        //create audiobuffer
        console.log("Setting audioBytes");
        let bufferSource = this.audioContext.createBufferSource();
        let audioBuffer = this.createAudioBuffer(audioBytesArray, audioDataType);
        bufferSource.buffer = audioBuffer;
        bufferSource.connect(this.analyser);
        bufferSource.start(bufferSource.buffer.duration);
    }

    public getAudioTimeDomain(): Uint8Array{
        let timeDomainData = new Uint8Array(this.analyser.fftSize);
        this.analyser.getByteTimeDomainData(timeDomainData)
        return timeDomainData;
    }  

    public getAudioFrequencyData(): Uint8Array{
        return this.audioFreqDomain;
    }

    private createAudioBuffer(audioBytesArray: ArrayBuffer, dataType: AudioType): AudioBuffer{
        let f32arr: Float32Array;
        if(dataType == AudioType.INT16){
            f32arr = this.convertShortArrayToFloat32(new Int16Array(audioBytesArray));
        }
        else if(dataType == AudioType.INT8){
            f32arr = this.convertBytesArrayToFloat32(new Int8Array(audioBytesArray));
        }
        else if(dataType == AudioType.INT32){
            f32arr = this.convertInt32ArrayToFloat32(new Int32Array(audioBytesArray));
        }

        let audioBuffer = this.audioContext.createBuffer(1, f32arr.length, 44100);
        audioBuffer.copyToChannel(f32arr, 0, 0);
        return audioBuffer;
    }

    private createF32Buffer(audioBytesArray: ArrayBuffer, dataType: AudioType){
        let f32arr: Float32Array;
        if(dataType == AudioType.INT16){
            f32arr = this.convertShortArrayToFloat32(new Int16Array(audioBytesArray));
        }
        else if(dataType == AudioType.INT8){
            f32arr = this.convertBytesArrayToFloat32(new Int8Array(audioBytesArray));
        }
        else if(dataType == AudioType.INT32){
            f32arr = this.convertInt32ArrayToFloat32(new Int32Array(audioBytesArray));
        }
        return f32arr;
    }

    private convertBytesArrayToFloat32(byteArray: Int8Array): Float32Array{
        const audioAsFloat = new Float32Array(byteArray.length); // allocate a float32 array
        for(let i=0;i<byteArray.length;i++){ 
            audioAsFloat[i] = byteArray[i]/127; //convert int16 to 1, maxvalue of int16 is 32767
        }
        return audioAsFloat;
    }

    private convertShortArrayToFloat32(shortArray: Int16Array): Float32Array{
        /**
         * convertShortArrayToFloat32: converts an Int16Array to a Float32Array between -1 and 1
         * @param shortArray: an Int16Array to be converted to a float32 array
         * @returns a float32 array, where the values are converted from shortArray
         */
        const audioAsFloat = new Float32Array(shortArray.length); // allocate a float32 array
        for(let i=0;i<shortArray.length;i++){ 
            audioAsFloat[i] = shortArray[i]/32767; //convert int16 to 1, maxvalue of int16 is 32767
        }
        return audioAsFloat;
    }

    private convertInt32ArrayToFloat32(intArray: Int32Array): Float32Array{
        const audioAsFloat = new Float32Array(intArray.length); // allocate a float32 array
        for(let i=0;i<intArray.length;i++){ 
            audioAsFloat[i] = intArray[i]/2147483647; //convert int32 to 1, maxvalue of int32 is 2,147,483,647
        }
        return audioAsFloat;
    }

}
