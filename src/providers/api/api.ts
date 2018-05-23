import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UrlProvider } from '../url/url';
import { Http,RequestOptions,Response,Headers } from '@angular/http';

/*
  Generated class for the ApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ApiProvider {

  constructor(public http: Http) {
    console.log('Hello ApiProvider Provider');
  }

  
  getBusRoutes() {
    // let access_token=localStorage.getItem('access_token');
    let url = UrlProvider.IP_ADDRESS + UrlProvider.BUS_ROUTES ;
    let body = new FormData();
    // body.append('searchText',searchText);
    return this.http.post(url,body);  
  }

  getBusList(route) {
    // let access_token=localStorage.getItem('access_token');
    let url = UrlProvider.IP_ADDRESS + UrlProvider.BUS_LIST ;
    let body = new FormData();
    body.append('route_id',route);
    return this.http.post(url,body);  
  }

  getCordinateList(route) {
    // let access_token=localStorage.getItem('access_token');
    let url = UrlProvider.IP_ADDRESS + UrlProvider.CORDINATE_LIST ;
    let body = new FormData();
    body.append('route_id',route);
    return this.http.post(url,body);  
  }
 
}
