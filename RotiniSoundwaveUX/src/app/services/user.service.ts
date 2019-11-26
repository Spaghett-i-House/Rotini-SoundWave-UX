import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user
  private userParameters: UserDefinedParameters;
  
  constructor() { 
    
  }

  private login(username: string, password: string){
    //make rest request here
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