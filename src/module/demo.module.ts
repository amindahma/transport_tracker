import { Paho } from 'ng2-mqtt/mqttws31';
import { HomePage} from '../pages/home/home';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ErrorHandler } from '@angular/core';
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { Geolocation } from '@ionic-native/geolocation';
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

    

  constructor(public username: String) {
    this.epfid = username + "_device";
    this.topic = username +"/PUB"
    this.server="167.99.195.237";
    this.client = new Paho.MQTT.Client(this.server, 8083, this.epfid);
    this.onMessage();
    this.onConnectionLost();
    this.client.connect({onSuccess: this.onConnected.bind(this)});

    

    this.geo =new Geolocation();

    this.geo.getCurrentPosition().then( data => {
      this.sendMessage(data.coords.latitude,data.coords.longitude);
      console.log(data)
    }).catch( err => console.log(err));
    
    let watch = this.geo.watchPosition();
    watch.subscribe((data) => {
      console.log(data)
      this.sendMessage(data.coords.latitude,data.coords.longitude);
    });

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
  }
}