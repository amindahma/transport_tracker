import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { MapPage } from '../map/map';

/**
 * Generated class for the TrainPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-train',
  templateUrl: 'train.html',
})
export class TrainPage {

  lines: string;
  selectedItem:any;
  train_items: Array<{icon: string, busNo: string, name: string, route_id: string, username: string}>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private apiProvider: ApiProvider) {
    this.selectedItem = navParams.get('item');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TrainPage');
  }

  trainTapped(event, item) {
    this.apiProvider.getCordinateList(item.route_id).subscribe(res => {
      console.log(res.json());
      // res.json().forEach(element => {
      //   console.log(element);
      //   var flightPlanCoordinates = [];
      //   flightPlanCoordinates.push({
          
      //   });
      // });
      this.navCtrl.push(MapPage, {
        flightPlanCoordinates: res.json(),
        username: item.username
      });
    }, err => {
    });
  }

}
