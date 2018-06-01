import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { MapPage } from '../map/map';
import { ApiProvider } from '../../providers/api/api';
import { elementAt } from 'rxjs/operator/elementAt';
import { BackgroundMode } from '@ionic-native/background-mode';

@Component({
  selector: 'page-bus',
  templateUrl: 'bus.html'
})
export class BusPage {

  // icon:string;
  bus_items: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private apiProvider: ApiProvider, private backgroundMode: BackgroundMode) {
    // If we navigated to this page, we will have an item available as a nav param
    this.bus_items = navParams.get('bus_items');
    // Let's populate this page with some filler content for funzies
    this.backgroundMode.enable();
  }

  busTapped(event, item) {
    this.apiProvider.getCordinateList(item.route_id).subscribe(res => {
      console.log(res.json());
      this.navCtrl.push(MapPage, {
        flightPlanCoordinates: res.json(),
        item: item,
        type: "bus"
      });
    }, err => {
    });
  }

  // getItems(ev: any) {
  //   // Reset items back to all of the items
  //   this.initializeItems();
  //   console.log("searching");
  //   // set val to the value of the searchbar
  //   let val = ev.target.value;

  //   // if the value is an empty string don't filter the items
  //   if (val && val.trim() != '') {
  //     this.items = this.items.filter((item) => {
  //       return ((item.routeNo.toLowerCase()+item.name.toLowerCase()).indexOf(val.toLowerCase()) > -1);
  //     })
  //   }
  // }

  // initializeItems() {
  //   this.items = this.items_original;
  // }
}
