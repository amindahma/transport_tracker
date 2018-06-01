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
import { Geolocation } from '@ionic-native/geolocation';
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
  my_marker: any;
  // marker_icon: string;
  flightPlanCoordinates: any;
  item: any;
  type: string;

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private backgroundMode: BackgroundMode, public geo: Geolocation) {
    this.flightPlanCoordinates = navParams.get('flightPlanCoordinates');
    this.item = navParams.get('item');
    this.type = navParams.get('type');
    // this.busType = navParams.get('marker_icon');
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
    if(this.type == "bus"){
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
    }
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
    if(this.type == "bus"){
      var image = 'assets/markers/bus/'+this.item.busType+'.png';
    }else if(this.type == "train"){
      var image = 'assets/markers/train/train-red.png';
    }else if(this.type == "staff"){
      var image = 'assets/markers/staff/staff-green.png';
    }else{
      var image = 'assets/markers/bus/bus.png';
    }
    var my_image = 'assets/markers/user/user-black.png';
    var marker =  new google.maps.Marker({
      position: loc,
      map: map,
      icon: image
    });

    var my_marker =  new google.maps.Marker({
      position: loc,
      map: map,
      icon: my_image
    });
    this.marker = marker;
    this.my_marker = my_marker;
    if(this.type == "bus"){
      var contentString = 
      '<span>Bus Type  :<b>'+ this.item.busType +'</b> </span><br>'+
      '<span>Bus Owner :<b>'+ this.item.ownerType +'</b> </span><br>'+
      '<span>Bus No    :<b>'+ this.item.busNo +'</b> </span><br>'+
      '<span>Contact No:<b>'+ this.item.telNo +'</b> </span><br>'
      ;
    }else if(this.type == "train"){
      var contentString = 
      '<span>Name  :<b>'+ this.item.name +'</b> </span><br>'+
      '<span>Start Station  :<b>'+ this.item.startStation +'</b> </span><br>'+
      '<span>Start Time :<b>'+ this.item.startTime +'</b> </span><br>'+
      '<span>End Station    :<b>'+ this.item.endStation +'</b> </span><br>'+
      '<span>End Time:<b>'+ this.item.endTime +'</b> </span><br>'
      ;
    }else if(this.type == "staff"){
      var contentString = 
      // '<span>Bus Type  :<b>'+ this.item.busType +'</b> </span><br>'+
      // '<span>Bus Owner :<b>'+ this.item.ownerType +'</b> </span><br>'+
      // '<span>Bus No    :<b>'+ this.item.busNo +'</b> </span><br>'+
      '<span>Contact No:<b>'+ "0712233333" +'</b> </span><br>'
      ;
    }else {
      var contentString = 
      // '<span>Bus Type  :<b>'+ this.item.busType +'</b> </span><br>'+
      // '<span>Bus Owner :<b>'+ this.item.ownerType +'</b> </span><br>'+
      // '<span>Bus No    :<b>'+ this.item.busNo +'</b> </span><br>'+
      '<span>Contact No:<b>'+ "0712233333" +'</b> </span><br>'
      ;
    }
    var infoWindow = new google.maps.InfoWindow({content: contentString});
    google.maps.event.addListener(marker, 'click', function () {
      infoWindow.open(map, marker);
    });
    // infoWindow.open(map, marker);

    this.geo.getCurrentPosition().then((data) => {
      this.updateMyMarker(new google.maps.LatLng(data.coords.latitude,data.coords.longitude));
    }).catch((error) => {
      console.log('Error getting location', error);
    });

    let watch = this.geo.watchPosition();
    watch.subscribe((data) => {
      this.updateMyMarker(new google.maps.LatLng(data.coords.latitude,data.coords.longitude));
    });
    
    this.subscribeBus();
  }

  subscribeBus(){
    this.epfid = "xxxxxxx";
    this.topic = this.item.username +"/PUB"
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

  updateMyMarker(position) {
    console.log(position);
    this.my_marker.setPosition(position);
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
