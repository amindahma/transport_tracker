import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

declare var google:any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  lat: any;
  lng: any;

  @ViewChild('map') mapRef:ElementRef;
  
  constructor(public navCtrl: NavController, public geo: Geolocation) {

  }

  ionViewDidLoad() {
    this.DisplayMap();
  }

  DisplayMap() {

    this.geo.getCurrentPosition().then( pos => {
      
      this.lat = pos.coords.latitude;
      this.lng = pos.coords.longitude;
      let location = new google.maps.LatLng(this.lat,this.lng);
      let options = {
        center:location,
        zoom:10,
        streetViewControl:false,
        mapTypeId:'roadmap'
      };
      let map = new google.maps.Map(this.mapRef.nativeElement, options);
  
      this.addMarker(location,map);

    }).catch( err => console.log(err));

  }

  addMarker(position,map) {
    return new google.maps.Marker({
      position,
      map
    });
  }

}
