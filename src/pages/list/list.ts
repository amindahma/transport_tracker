import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { MapPage } from '../map/map';
import { ApiProvider } from '../../providers/api/api';
import { elementAt } from 'rxjs/operator/elementAt';
import { BusPage } from '../bus/bus';
import { BackgroundMode } from '@ionic-native/background-mode';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  selectedItem: any;
  routes:any;
  buses:any;
  items_original:any;
  icons: string[];
  items: Array<{routeNo: string, name: string, id: string}>;
  bus_items: Array<{busType: string, icon: string, busNo: string, name: string, route_id: string, username: string, ownerType: string, telNo: string}>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private apiProvider: ApiProvider, private backgroundMode: BackgroundMode) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
    // Let's populate this page with some filler content for funzies
    this.apiProvider.getBusRoutes().subscribe(res => {
      console.log(res);
      this.routes=res.json();
      
      this.items = [];
      this.routes.forEach(element => {
        console.log(element);
        this.items.push({
          routeNo: element.routeNo,
          name: element.name,
          id: element.id
        });
      });
      this.items_original = this.items;
    }, err => {
    });
    this.backgroundMode.enable();
  }

  itemTapped(event, item) {
    this.selectedItem = item;
    this.apiProvider.getBusList(item.id).subscribe(res => {
      console.log(res.json());
      this.buses=res.json();
      
      this.bus_items = [];
      this.buses.forEach(element => {
        console.log(element);
        var icon;
        if(element.ownerType == ""){
          if(element.ds= ""){
            icon = ""
          }
        }else{
          icon = "ios-bus-outline"
        }
        this.bus_items.push({
          icon: icon,
          busType: element.busType,
          busNo: element.busNo,
          name: element.name,
          route_id: element.route_id,
          username: element.username,
          ownerType: element.ownerType,
          telNo:element.telNo
        });
      });
      this.navCtrl.push(BusPage, {
        bus_items: this.bus_items
      });
    }, err => {
    });

  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();
    console.log("searching");
    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return ((item.routeNo.toLowerCase()+item.name.toLowerCase()).indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  initializeItems() {
    this.items = this.items_original;
  }
}
