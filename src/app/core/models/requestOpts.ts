import { Http, Headers} from '@angular/http';
import { HttpParams } from '@angular/common/http';


export class RequestOpts {
    public params : HttpParams;
    public headers : Headers;

    constructor(){
      this.params = new HttpParams();
      this.headers = new Headers();
    }
}