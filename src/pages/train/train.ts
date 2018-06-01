import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { MapPage } from '../map/map';
import { BackgroundMode } from '@ionic-native/background-mode';

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
  train_items: Array<{icon: string, name: string, line_id: string, endStation: string, endTime: string, startStation: string, startTime: string, username: string}>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private apiProvider: ApiProvider, private backgroundMode: BackgroundMode) {
    this.selectedItem = navParams.get('item');
    this.backgroundMode.enable();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TrainPage');
  }

  onSelectLine(item) {
    this.selectedItem = item;
    // console.log(item);
    this.apiProvider.getTrainList(item).subscribe(res => {
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
          name: element.name,
          line_id: this.selectedItem,
          endStation: element.endStation,
          endTime: element.endTime,
          startStation: element.startStation,
          startTime: element.startTime,
          username: element.username
        });
      });
    }, err => {
    });

  }

  trainTapped(event, item) {
    // this.apiProvider.getCordinateList(item.route_id).subscribe(res => {
    //   console.log(res.json());
      // res.json().forEach(element => {
      //   console.log(element);
      //   var flightPlanCoordinates = [];
      //   flightPlanCoordinates.push({
          
      //   });
      // });
      
    // }, err => {
    // });
    this.navCtrl.push(MapPage, {
      // flightPlanCoordinates: res.json(),
      type: "train",
      item: item
    });
  }

}
