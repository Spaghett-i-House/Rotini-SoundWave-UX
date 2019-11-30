export class User {
    protected registeredDevices: Array<[string, number]>;
    protected colorProfiles: Map<string, Array<string>>;

    constructor(){
        this.registeredDevices = [];
        this.colorProfiles = new Map<string, Array<string>>();
        //add the default values, candy and halloween
        this.colorProfiles.set('candy', ["#ffd1dc", "#ffd9e2"]);
        this.colorProfiles.set('halloween', ['#ff7a1c', "#2b2b2b"]);
    }

    public getColorProfileNames(){
        return Array.from(this.colorProfiles.keys());
    }

    public getColorProfile(profileName: string): Array<string>{
        return this.colorProfiles.get(profileName);
    }

    public getRegisteredDevices(): Array<[string, number]>{
        return this.registeredDevices;
    }

    public addRegisteredDevice(addr: string, port: number){
        //since this is an unauthenticated user we dont need to update db
        this.registeredDevices.push([addr, port]);
    }

    public addProfile(name: string, colors: Array<string>){
        this.colorProfiles.set(name, colors);
    }
}

export interface UserResponse {
    id: string;
    registered_devices: Array<[string, number]>;
    color_profiles: Array<ColorProfile>;
}

export interface ColorProfile{
    name: string;
    colors: Array<string>;
}
