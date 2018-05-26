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

  train_list: any;
  selectedItem:any;
  train_items: Array<{icon: string, trainNo: string, name: string, line_id: string, username: string}>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private apiProvider: ApiProvider) {
    this.selectedItem = navParams.get('item');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TrainPage');
  }

  onSelectLine(item) {
    this.selectedItem = item;
    this.apiProvider.getBusList("776").subscribe(res => {
      console.log(res.json());
      this.train_list=res.json();
      this.train_items = [];
      this.train_list.forEach(element => {
        console.log(element);
        var icon;
        if(element.ownerType == ""){
          if(element.ds= ""){
            icon = ""
          }
        }else{
          icon = "ios-bus-outline"
        }
        this.train_items.push({
          icon: icon,
          trainNo: element.busNo,
          name: element.name,
          line_id: element.route_id,
          username: element.username
        });
      });
    }, err => {
    });

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
