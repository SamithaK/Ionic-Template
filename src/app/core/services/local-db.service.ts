import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalDBService {

  constructor() { }

  async getData(key : string): Promise<string>{
    return localStorage.getItem(key)
  }

  async setData(key : string, value : any){
    return localStorage.setItem(key, value);
  }

  async setObjectData(key : string, value : any){
    let val = JSON.stringify(value)
    return localStorage.setItem(key, val);
  }

  async getObjectData(key : string): Promise<any>{
    let res = localStorage.getItem(key)
    return await JSON.parse(res)
  }

  
}
