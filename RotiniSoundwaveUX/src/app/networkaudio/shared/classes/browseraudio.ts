import {AudioType} from '../model/types';

export class Browseraudio {
    /**
     * Browseraudio: a class to ease the analysis of and use of audio data
     */

    private audioContext: AudioContext;
    private bufferSource: AudioBufferSourceNode;
    public analyser: AnalyserNode;

    constructor(){
        this.audioContext = new AudioContext();
        this.bufferSource = this.audioContext.createBufferSource();
        this.analyser = this.audioContext.createAnalyser();
        this.bufferSource.connect(this.analyser);
        this.bufferSource.start();
    }

    public setAudioBytes(audioBytesArray: ArrayBuffer, audioDataType: AudioType, channels: number){
        //create audiobuffer
        let audioBuffer = this.createAudioBuffer(audioBytesArray, audioDataType);
        this.bufferSource.buffer = audioBuffer;
        //copy audiodata into audiobuffer
        throw(Error("setAudioBytes not implemented"));
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
