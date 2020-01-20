import { Injectable, Optional, Inject } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BASE_PATH } from 'src/environments/variables';
import { RequestOpts } from '../models/requestOpts';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl: string = ''
  private auth = {
    token:""
  }
  constructor(private http: Http, @Optional() @Inject(BASE_PATH) basePath: string) { 
    if (basePath) {
      this.apiUrl = basePath;
    }
  }

  get(endpoint: string, params?: any, reqOpts?: RequestOpts) {
    // Support easy query params for GET requests
    if (params) {
      reqOpts.params = new HttpParams();
      for (let k in params) {
        reqOpts.params.set(k, params[k]);
      }
    }
    // Append token
    reqOpts.headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': this.auth.token
    })
    if (params) {
      return this.http.get(this.apiUrl, reqOpts)
    } else {
      return this.http.get(this.apiUrl, reqOpts)
    }
  }


  post(endpoint: string, body: any, reqOpts?: RequestOpts) {

    let headers = new Headers();
    headers.append('Content-Type', 'application/json')
    headers.append('Accept', 'application/json')
    headers.append('Accept', this.auth.token)
    return this.http.post(this.apiUrl + '/' + endpoint, body, { headers: headers }).pipe(map(r => r.json()))
  }

  postL(endpoint: string, body: any, reqOpts?: RequestOpts) {

    let head = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    return this.http.post(this.apiUrl + '/' + endpoint, body, { headers: head }).pipe(map(r => r.json()))
  }

  put(endpoint: string, body: any, reqOpts?: any) {
    if (!reqOpts) {
      reqOpts = {};
    }
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'my-auth-token'
    })
    reqOpts.headers = headers
    return this.http.put(this.apiUrl + '/' + endpoint, body, reqOpts)
  }

  delete(endpoint: string, reqOpts?: any) {
    if (!reqOpts) {
      reqOpts = {};
    }
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'my-auth-token'
    })
    reqOpts.headers = headers
    return this.http.delete(this.apiUrl + '/' + endpoint, reqOpts)
  }

  patch(endpoint: string, body: any, reqOpts?: any) {
    if (!reqOpts) {
      reqOpts = {};
    }
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'my-auth-token'
    })
    reqOpts.headers = headers
    return this.http.put(this.apiUrl + '/' + endpoint, body, reqOpts)
  }


}
