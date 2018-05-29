import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Paho } from 'ng2-mqtt/mqttws31';
// import { HomePage} from '../pages/home/home';
// import { Component } from '@angular/core';
// import { NavController } from 'ionic-angular';
import { ErrorHandler } from '@angular/core';
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { BackgroundMode } from '@ionic-native/background-mode';
// import { Geolocation } from '@ionic-native/geolocation';
// import { MapPage } from '../pages/map/map';

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

@Injectable()

export class MapPage {

  lat: any;
  lng: any;
  map:any;
  marker: any;
  marker_icon: string;
  flightPlanCoordinates: any;
  username: String;

  // public subject1 = new Subject<any>();
  // public subject2 = new Subject<any>();
  public newMessage; 
  public connect=false;
  
  client;
  server: string;
  epfid: string;
  // line:number=1;
  // geo:any;
  topic: string;

  numDeltas = 100;
  delay =2; //milliseconds
  i = 0;
  deltaLat;
  deltaLng;
  lastLat= 0.0;
  lastLng= 0.0;

  @ViewChild('map') mapRef:ElementRef;

  items: Array<{username: string, map: any, marker: any}>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private backgroundMode: BackgroundMode) {
    this.flightPlanCoordinates = navParams.get('flightPlanCoordinates');
    this.username = navParams.get('username');
    this.marker_icon = navParams.get('marker_icon');
    this.backgroundMode.enable();
    // this.backgroundMode.moveToBackground();
  }


  ionViewDidLoad() {
    this.DisplayMap();
    this.subscribeBus();
  }

  ionViewWillLeave() {
    this.stop();
    console.log("Looks like I'm about to leave :(");
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
    var map =  this.map;
    var flightPath = new google.maps.Polyline({
      path: this.flightPlanCoordinates,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });

    flightPath.setMap(this.map);

    var bounds = new google.maps.LatLngBounds();
    // console.log(this.flightPlanCoordinates[0])
    bounds.extend(new google.maps.LatLng(this.flightPlanCoordinates[0].lat, this.flightPlanCoordinates[0].lng));
    bounds.extend(new google.maps.LatLng(this.flightPlanCoordinates[this.flightPlanCoordinates.length-1].lat, this.flightPlanCoordinates[this.flightPlanCoordinates.length-1].lng));
    this.map.fitBounds(bounds);

  //   this.geo.getCurrentPosition().then( pos => {
      
  //     this.lat = pos.coords.latitude;
  //     this.lng = pos.coords.longitude;
     
  //     let options = {
  //       center:location,
  //       zoom:10,
  //       streetViewControl:false,
  //       mapTypeId:'roadmap'
  //     };
  //     var map = new google.maps.Map(this.mapRef.nativeElement, options);
  //     this.map = map
      var loc = new google.maps.LatLng(0,0);
      // var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
      var image = 'assets/markers/bus/'+this.marker_icon+'.png';
      this.marker =  new google.maps.Marker({
        position: loc,
        map: map,
        icon: image
      });
      // this.marker = marker;
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
    
    this.subscribeBus();
  }

  subscribeBus(){
    this.epfid = "xxxxxxx";
    this.topic = this.username +"/PUB"
    this.server="167.99.195.237";
    this.client = new Paho.MQTT.Client(this.server, 8083, this.epfid);
    this.onMessage();
    this.onConnectionLost();
    this.client.connect({onSuccess: this.onConnected.bind(this)});
  }

  onConnected() {
    console.log("Connected");
    this.connect = true;
    this.client.subscribe(this.topic);
    // this.client.subscribe("Mobile/Line"+this.line);
    // this.sendMessage('start');
    // this.sendMessage(12.3, 6.3);
  }

  onMessage() {
    this.client.onMessageArrived = (message: Paho.MQTT.Message) => {
    this.newMessage =message.payloadString; 
    console.log('Message arriveddd : ' + message.payloadString);
    // console.log(message.destinationName);
    var splitted = this.newMessage.split(",",2);
    // console.log(splitted);
    var loc = new google.maps.LatLng(parseFloat(splitted[0]),parseFloat(splitted[1]));
    // console.log(this.marker);
    // this.transition(parseFloat(splitted[0]),parseFloat(splitted[1]), this.marker);
    this.updateMarker(loc);
    // if(message.destinationName=="Mobile
    // if(message.destinationName=="Mobile/Line"+this.line){
    //   this.subject1.next(message.payloadString)
    // }
    };  
  }

  onConnectionLost() {
    this.client.onConnectionLost = (responseObject: Object) => {
      console.log('Connection lost : ' + JSON.stringify(responseObject));
      this.connect = false;
    };
  }

  stop(){
    this.client.unsubscribe(this.topic);
    this.client.disconnect();
  }

  updateMarker(position) {
    console.log(position);
    this.marker.setPosition(position);
  }


  transition(newLat, newLng, marker){
      this.i = 0;
      this.deltaLat = (newLat - this.lastLat)/this.numDeltas;
      this.deltaLng = (newLng - this.lastLng)/this.numDeltas;
      this.moveMarker(marker);
  }

  moveMarker(marker){
      this.lastLat += this.deltaLat;
      this.lastLng += this.deltaLng;
      var latlng = new google.maps.LatLng(this.lastLat, this.lastLng);
      console.log(this.lastLat);
      marker.setPosition(latlng);
      if(this.i!=this.numDeltas){
          this.i++;
          setTimeout(this.moveMarker(marker), this.delay);
      }
  } 

}
