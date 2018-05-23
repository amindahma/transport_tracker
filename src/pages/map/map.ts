import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the MapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google:any;

@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})

export class MapPage {

  lat: any;
  lng: any;
  map:any;
  marker: any;

  @ViewChild('map') mapRef:ElementRef;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }


  ionViewDidLoad() {
    this.DisplayMap();
  }

  DisplayMap() {

    let location = new google.maps.LatLng(7.710224,80.6567713);
    let options = {
      center:location,
      zoom:7,
      streetViewControl:false,
      mapTypeId:'roadmap'
    };
    this.map = new google.maps.Map(this.mapRef.nativeElement, options);

  //   this.geo.getCurrentPosition().then( pos => {
      
  //     this.lat = pos.coords.latitude;
  //     this.lng = pos.coords.longitude;
  //     let location = new google.maps.LatLng(this.lat,this.lng);
  //     let options = {
  //       center:location,
  //       zoom:10,
  //       streetViewControl:false,
  //       mapTypeId:'roadmap'
  //     };
  //     var map = new google.maps.Map(this.mapRef.nativeElement, options);
  //     this.map = map
  //     var marker =  new google.maps.Marker({
  //       location,
  //       map
  //     });
  //     this.marker = marker;
  //     var infoWindow = new google.maps.InfoWindow({content: "You are Here!"});
  //     google.maps.event.addListener(marker, 'click', function () {
  //       infoWindow.open(map, marker);
  //     });
  //     infoWindow.open(map, marker);

  //   }).catch( err => console.log(err));

  //   let watch = this.geo.watchPosition();
  //   watch.subscribe((data) => {
  //     let location = new google.maps.LatLng(data.coords.latitude, data.coords.longitude);
  //     this.map.setZoom(13);      // This will trigger a zoom_changed on the map
  //     this.map.setCenter(location);
  //     this.updateMarker(location, this.marker);
  //   });

  }

  updateMarker(position, marker) {
    marker.setPosition(position);
  }

}
