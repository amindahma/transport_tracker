import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { MapPage } from '../map/map';
import { ApiProvider } from '../../providers/api/api';
import { elementAt } from 'rxjs/operator/elementAt';

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
  bus_items: Array<{icon: string, busNo: string, name: string, route_id: string, username: string}>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private apiProvider: ApiProvider) {
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
    this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
    'american-football', 'boat', 'bluetooth', 'build'];

    

    // this.items = [];
    // for (let i = 1; i < 11; i++) {
    //   this.items.push({
    //     title: 'Item ' + i,
    //     note: 'This is item #' + i,
    //     icon: this.icons[Math.floor(Math.random() * this.icons.length)]
    //   });
    // }
  }

  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
    // this.navCtrl.push(ListPage, {
    //   item: item
    // });
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
          icon = "bus"
        }
        this.bus_items.push({
          icon: icon,
          busNo: element.busNo,
          name: element.name,
          route_id: element.route_id,
          username: element.username
        });
      });
    }, err => {
    });

  }

  busTapped(event, item) {
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
