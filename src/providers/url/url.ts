import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the UrlProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UrlProvider {

  constructor(public http: HttpClient) {
    console.log('Hello UrlProvider Provider');
  }

  static IP_ADDRESS="http://167.99.195.237/bus_tracker_server/web/app_dev.php/api/";
  static BUS_ROUTES="route/list";
  static BUS_LIST="bus/list";
  static CORDINATE_LIST="coordinate/list";

}
