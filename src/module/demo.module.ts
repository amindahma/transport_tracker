import { Paho } from 'ng2-mqtt/mqttws31';
import { HomePage} from '../pages/home/home';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ErrorHandler } from '@angular/core';
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { Geolocation } from '@ionic-native/geolocation';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation';
import { BackgroundMode } from '@ionic-native/background-mode';
@Injectable()


export class MqttConnection {
    public subject1 = new Subject<any>();
    public subject2 = new Subject<any>();
    public newMessage; 
    public connect=false;
    
    client;
    server: string;
    epfid: string;
    line:number=1;
    geo:any;
    topic: string;
    backgroundMode:any;
    backgroundGeolocation:any;

    

  constructor(public username: String) {
    this.epfid = username + "_device";
    this.topic = username +"/PUB"
    this.server="167.99.195.237";
    this.client = new Paho.MQTT.Client(this.server, 8083, this.epfid);
    this.onMessage();
    this.onConnectionLost();
    this.client.connect({onSuccess: this.onConnected.bind(this)});

    

    this.geo =new Geolocation();
    this.backgroundGeolocation = new  BackgroundGeolocation();
    this.geo.getCurrentPosition().then( data => {
      this.sendMessage(data.coords.latitude,data.coords.longitude);
      console.log(data);
      console.log("11111111111111111111111111111111111111111111111111111111111111111111111111111111111");
    }).catch( err => console.log(err));
    
    let watch = this.geo.watchPosition();
    watch.subscribe((data) => {
      console.log(data);
      console.log("11111111111111111111111111111111111111111111111111111111111111111111111111111111111");
      this.sendMessage(data.coords.latitude,data.coords.longitude);
    });
    this.backgroundMode = new  BackgroundMode();
    this.backgroundMode.enable();
    this.backgroundMode.disableWebViewOptimizations();

    const config: BackgroundGeolocationConfig = {
      desiredAccuracy: 10,
      stationaryRadius: 20,
      distanceFilter: 30,
      debug: false, //  enable this hear sounds for background-geolocation life-cycle.
      stopOnTerminate: false, // enable this to clear background location settings when the app terminates
      interval: 3000
    };

    this.backgroundGeolocation.configure(config).subscribe((location: BackgroundGeolocationResponse) => {

      console.log(location);
      this.sendMessage(location.latitude,location.longitude);
      console.log("2222222222222222222222222222222222222222222222222222222222222222222222222222");
    // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
    // and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
    // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
    // this.backgroundGeolocation.finish(); // FOR IOS ONLY

    });

    // start recording location
    this.backgroundGeolocation.start();

  }

  onConnected() {
    console.log("Connected");
    this.connect = true;
    // this.client.subscribe("nCinga/Line"+this.line);
    // this.client.subscribe("Mobile/Line"+this.line);
    // this.sendMessage('start');
    // this.sendMessage(12.3, 6.3);
  }

    sendMessage(lat: any, lng: any) {
    let packet = new Paho.MQTT.Message(lat+","+lng);
    packet.destinationName = this.topic;
    this.client.send(packet);
  }
  //   sendMessageBA(message: string) {
  //   let packet = new Paho.MQTT.Message(message);
  //   packet.destinationName = "nCinga/mobile/request";
  //   this.client.send(packet);
  // }
  // sendMessageExit(message: string) {
  //   let packet = new Paho.MQTT.Message(message);
  //   packet.destinationName = "nCinga/mobile/exit";
  //   this.client.send(packet);
  // }

  onMessage() {
      this.client.onMessageArrived = (message: Paho.MQTT.Message) => {
      this.newMessage =message.payloadString; 
      console.log('Message arriveddd : ' + message.payloadString);
      console.log(message.destinationName);
      if(message.destinationName=="Mobile/Line"+this.line){
        this.subject1.next(message.payloadString)
      }
    };  
  }

  onConnectionLost() {
    this.client.onConnectionLost = (responseObject: Object) => {
      console.log('Connection lost : ' + JSON.stringify(responseObject));
      this.connect = false;
    };
  }

  stop(){
    this.client.disconnect();
    this.backgroundGeolocation.stop();
  }
}