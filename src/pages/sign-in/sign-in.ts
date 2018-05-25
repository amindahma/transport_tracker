import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { NativeStorage } from '@ionic-native/native-storage';
import { ToastController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { MyApp } from '../../app/app.component';

/**
 * Generated class for the SignInPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-sign-in',
  templateUrl: 'sign-in.html',
})
export class SignInPage {

  username = '';
  password = '';
  myApp: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private apiProvider: ApiProvider, private nativeStorage: NativeStorage, private toastCtrl: ToastController) {
    this.myApp = navParams.get('myApp');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignInPage');
  }

  clickLogin(){
    this.apiProvider.authenticate(this.username, this.password).subscribe(res => {
      console.log(res.json());
      var result = res.json();
      if(result.status == 200){
        
        // this.myApp.startMqtt(result.username);
        this.nativeStorage.setItem('user', {
          status: result.status, 
          busId: result.busId,
          busNo: result.busNo,
          routeName: result.routeName,
          routeNo: result.routeNo,
          route_id: result.route_id,
          username: result.username,
        })
          .then(
            () => this.presentToast("Signed in successfully", HomePage, "toast-green"),
            error => console.error('Error storing item', error)
          );

        this.nativeStorage.getItem('user')
          .then(
            data => console.log(data.status),
            error => console.error(error)
          );
      }else{
        this.presentOnlyToast("username or password is incorrect", "toast-red")
      }
    }, err => {
    });
  }

  presentToast(msg, page,css) {
    this.myApp.setActive(200);
    this.navCtrl.setRoot(page, {
    });

    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom',
      cssClass: css
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }

  presentOnlyToast(msg, css) {

    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom',
      cssClass: css
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }


}
