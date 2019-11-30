import {User, UserResponse, ColorProfile} from "./user";

export class AuthenticatedUser extends User{
    private username: string;
    private password: string;

    constructor(username: string, password: string, userjson: UserResponse){
        super();
        this.username = username;
        this.password = password;

        this.registeredDevices = userjson['devices']
        const colorobject = userjson.color_profiles;
        this.colorProfiles = new Map<string, Array<string>>();
        colorobject.forEach((profile: ColorProfile) => {
            this.colorProfiles[profile.name] = profile.colors;
        });
    }

    public addRegisteredDevice(addr: string, port: number){
        super.addRegisteredDevice(addr, port);
        //reach out to database
    }

    public addProfile(name: string, colors: Array<string>){
        super.addProfile(name, colors);
        //reach out to and update database
    }

    public getUsername(){
        return this.username;
    }

    public getPassword(){
        return this.password;
    }
}
