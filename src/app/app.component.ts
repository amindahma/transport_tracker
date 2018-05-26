import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { TrainPage } from '../pages/train/train';
import { SignInPage } from '../pages/sign-in/sign-in';
import { StaffPage } from '../pages/staff/staff';
import { SchoolPage } from '../pages/school/school';
import { NativeStorage } from '@ionic-native/native-storage';
import { MqttConnection } from '../module/demo.module';
import { ApiProvider } from '../providers/api/api';
import { BackgroundMode } from '@ionic-native/background-mode';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;
  sign_in:string;
  active:boolean = false;
  not_active:boolean = true;
  started:boolean = false;
  stopped:boolean = true;
  mqtt:any;
  username:any;
  password:any;

  pages: Array<{title: string, component: any, icon: string, color: string}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,private nativeStorage: NativeStorage, private toastCtrl: ToastController, private apiProvider: ApiProvider, private backgroundMode: BackgroundMode) {
    this.initializeApp();
    
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Bus', component: ListPage, icon: "ios-bus-outline", color: "orange" },
      { title: 'Train', component: TrainPage, icon: "ios-train-outline", color: "orange" },
      { title: 'Staff Service', component: StaffPage, icon: "ios-car-outline", color: "orange" },
      { title: 'School Service', component: SchoolPage, icon: "ios-bus-outline", color: "orange" }
    ];

    this.checkUser();
    // if()
    this.backgroundMode.enable();
  }

  checkUser(){
    this.nativeStorage.getItem('user')
      .then(
        data => this.setActive(data.status),
        error => this.setActive(400)
    );
  }

  setActive(status){
    // console.error(status)
    if(status == 200){
      this.active = true;
      this.not_active = false;
      this.nativeStorage.getItem('user')
        .then(
          data => this.setData(data),
          error => console.error(error)
        );
    }else{
      this.active = false;
      this.not_active = true;
    }
    // console.error(status);
    // console.error(this.active);
    // console.error(this.not_active);
  }

  setData(data){
    this.username = data.username;
    this.password = data.password;
  }

  startMqtt(){
    console.log(this.username);
    console.log(this.password);
    this.mqtt = new MqttConnection(this.username);
  }

  stopMqtt(){
    this.mqtt.stop();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
  openHomePage() {
    this.nav.setRoot(HomePage);
  }
  openSignInPage() {
    this.nav.setRoot(SignInPage, {
      myApp: this
    });
  }

  logOut(){
    this.nativeStorage.setItem('user', {
      status: 400
    })
      .then(
        () => console.error('Error storing item'),
        error => console.error('Error storing item', error)
      );
    this.setActive(400);
    this.stop();
    this.presentToast("Logged out Successfully", HomePage)
  }

  presentToast(msg, page) {

    this.nav.setRoot(page, {
    });
    
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }

  stop(){
    this.stopped = true;
    this.started = false;
    this.stopMqtt();
  }

  start(){
    this.apiProvider.authenticate(this.username, this.password).subscribe(res => {
      this.stopped = false;
      this.started = true;
      this.startMqtt();
    }, err => {
    });
  }
}
