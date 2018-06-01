import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BackgroundMode } from '@ionic-native/background-mode';

/*
  Generated class for the UrlProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UrlProvider {

  constructor(public http: HttpClient, private backgroundMode: BackgroundMode) {
    console.log('Hello UrlProvider Provider');
    this.backgroundMode.enable();
  }

  static IP_ADDRESS="http://167.99.195.237/bus_tracker_server/web/app_dev.php/";
  static BUS_ROUTES="api/route/list";
  static BUS_LIST="api/bus/list";
  static TRAIN_LIST="api/train/list";
  static CORDINATE_LIST="api/coordinate/list";
  static AUTHENTICATE="driver/api/login";

}
