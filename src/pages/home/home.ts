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
  map:any;
  marker: any;

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
      var map = new google.maps.Map(this.mapRef.nativeElement, options);
      this.map = map
      var marker =  new google.maps.Marker({
        location,
        map
      });
      this.marker = marker;
      var infoWindow = new google.maps.InfoWindow({content: "You are Here!"});
      google.maps.event.addListener(marker, 'click', function () {
        infoWindow.open(map, marker);
      });
      infoWindow.open(map, marker);

    }).catch( err => console.log(err));

    let watch = this.geo.watchPosition();
    watch.subscribe((data) => {
      let location = new google.maps.LatLng(data.coords.latitude, data.coords.longitude);
      this.map.setZoom(13);      // This will trigger a zoom_changed on the map
      this.map.setCenter(location);
      this.updateMarker(location, this.marker);
    });

  }

  updateMarker(position, marker) {
    marker.setPosition(position);
  }

}
