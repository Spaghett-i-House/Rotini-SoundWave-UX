import { Injectable } from '@angular/core';
import {User, UserResponse} from '../model/user';
import {AuthenticatedUser} from '../model/authenticateduser';
import {HttpClient, HttpHeaders} from '@angular/common/http';

/**
 * UserService: A service to handle user instances, as well as the user->database interaction
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {
  public user: User;

  constructor(private http: HttpClient) {
    this.user = new User();
  }

  /**
   * login provides an external interface to allow logging in to the service
   * @param username the username of the user to be logge
   * @param password 
   */
  public async login(username: string, password: string){
    try{
      this.user = await this.getDatabaseUser(username, password);
    } catch (err) {
      console.error(err);
    }
  }

  public async logout(){
    this.user = new User();
  }

  public addDeviceToDirectory(address: string, port: number){
    //attempt to update the database for the user
    this.user.addRegisteredDevice(address, port);
    //update the current user class
    this.updateDatabaseUser();
  }

  public addColorPreset(name: string, colors: Array<string>){
    this.user.addProfile(name, colors);
    this.updateDatabaseUser();
  }

  private async updateDatabaseUser(){
    if(this.user instanceof AuthenticatedUser){
      const headers = new HttpHeaders();
      headers.set('authorization', `basic ${this.user.getUsername()}:${this.user.getPassword()}`);
      const config = {
        headers: headers
      };
      let response = this.http.patch('api/user', this.user, config).toPromise()
      try{
        let updatedUser = await response;
        console.log(`Updated user to ${updatedUser}`);
      } catch (err){
        console.error(err);
      }

    }
  }

  private async getDatabaseUser(username: string, password: string){
    const headers = new HttpHeaders();
    headers.set('authorization', `basic ${username}:${password}`)
    const config = {
      headers: headers
    };
    const response = this.http.get<UserResponse>('api/user', config).toPromise();
    try{
      let userObject = await response;
      return new AuthenticatedUser(username, password, userObject);
    } catch (err) {
      throw err;
    }
  }

  private async createDatabaseUser(username: string, password: string){
    const headers = new HttpHeaders();
    headers.set('authorization', `basic ${username}:${password}`)
    const config = {
      headers: headers
    };
    const response = this.http.post<UserCreationMessage>('api/user', config).toPromise();
    try{
      let creationMessage = await response;
      if (creationMessage.status == 1){
        //this creation worked new user created
        console.log("User was created successfully");
        const newUser = await this.getDatabaseUser(username, password);
        return newUser;
      }
      else{
        //creation failed probably due to username already taken
        throw Error(creationMessage.message);
      }
      //return new AuthenticatedUser(username, password, userObject);
    } catch (err) {
      throw err;
    }
  }
}

interface UserDefinedParameters{
  activeColorProfile: ColorProfile;
  frequencyParameter: FrequencyProfile;
  defaultDevice: AudioSource;
}

interface ColorProfile {
  name: string;
  colors: Array<string>;
}

interface FrequencyProfile {
  minFrequency: number;
  maxFrequency: number;
}

interface AudioSource {
  address: string;
  port: number;
  name: string;
  devices: Array<string>;
}

interface UserCreationMessage{
  status: number;
  message: string;
}