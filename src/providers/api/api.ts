import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UrlProvider } from '../url/url';
import { Http,RequestOptions,Response,Headers } from '@angular/http';
import { BackgroundMode } from '@ionic-native/background-mode';

/*
  Generated class for the ApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ApiProvider {

  constructor(public http: Http, private backgroundMode: BackgroundMode) {
    console.log('Hello ApiProvider Provider');
    this.backgroundMode.enable();
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

  getTrainList(line) {
    // let access_token=localStorage.getItem('access_token');
    let url = UrlProvider.IP_ADDRESS + UrlProvider.TRAIN_LIST ;
    let body = new FormData();
    body.append('line',line);
    return this.http.post(url,body);  
  }

  getCordinateList(route) {
    // let access_token=localStorage.getItem('access_token');
    let url = UrlProvider.IP_ADDRESS + UrlProvider.CORDINATE_LIST ;
    let body = new FormData();
    body.append('route_id',route);
    return this.http.post(url,body);  
  }
  authenticate(username, password) {
    // let access_token=localStorage.getItem('access_token');
    let url = UrlProvider.IP_ADDRESS + UrlProvider.AUTHENTICATE ;
    let body = new FormData();
    body.append('username',username);
    body.append('password',password);
    return this.http.post(url,body);  
  }

  changePassord(username, old_password, new_password) {
    // let access_token=localStorage.getItem('access_token');
    let url = UrlProvider.IP_ADDRESS + UrlProvider.CHANGE_PASSWORD ;
    let body = new FormData();
    body.append('username',username);
    body.append('old_password',old_password);
    body.append('new_password',new_password);
    return this.http.post(url,body);  
  }


 
}
