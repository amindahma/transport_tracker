import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { NativeStorage } from '@ionic-native/native-storage';
import { ToastController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { MyApp } from '../../app/app.component';
import { BackgroundMode } from '@ionic-native/background-mode';

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  username = '';
  password = '';
  old_password = "";
  new_password = '';
  myApp: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private apiProvider: ApiProvider, private nativeStorage: NativeStorage, private toastCtrl: ToastController, private backgroundMode: BackgroundMode) {
    this.myApp = navParams.get('myApp');
    this.username = navParams.get('username');
    this.password = navParams.get('password');
    this.backgroundMode.enable();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  clickChangePassword(){
    console.log("old password: "+this.old_password);
    console.log("password: "+this.password);
    if(this.old_password == this.new_password){
      this.presentOnlyToast("New passord is same as the Old Password", "toast-red")
    }else if(this.old_password != this.password){
      this.presentOnlyToast("Passord is incorrect", "toast-red")
    }else{
      this.apiProvider.changePassord(this.username, this.password, this.new_password).subscribe(res => {
        console.log(res.json());
        var result = res.json();
        if(result.status == 200){
          this.myApp.setPassword(this.new_password);
          this.presentToast("Password updated successfully !", HomePage, "toast-green")
        }else{
          this.presentOnlyToast("Network Error", "toast-red")
        }
      }, err => {
      });
    }
  }

  presentToast(msg, page,css) {
    // this.myApp.setActive(200);
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
