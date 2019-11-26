export class User {
    private username: string;
    private passwordHash: string;
    private registeredDevices: Array<[string, number]>;
    private colorProfiles: Map<string, Array<string>>;

    constructor(username: string, passwordHash: string, registeredDevices, colorProgiles){

    }

    /**
     * receiveUserJson: parse user information json from database and turn it into th
     * @param userjson 
     */
    public receiveUserJson(userjson: Object){
        /**
         * {
         *  userid: number
         *  registeredDevices: [(ip: port)]
         *  profiles: {
         *      "colorname": [htmlcolorcodes]
         *  }
         * }
         */ 
    }
}
