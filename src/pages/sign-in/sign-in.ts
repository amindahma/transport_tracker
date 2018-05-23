import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { NativeStorage } from '@ionic-native/native-storage';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private apiProvider: ApiProvider, private nativeStorage: NativeStorage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignInPage');
  }

  clickLogin(){
    this.apiProvider.authenticate(this.username, this.password).subscribe(res => {
      console.log(res.json());
      var result = res.json();
      if(result.status == 200){
        this.nativeStorage.setItem('sign_in', {active: 'yes'})
          .then(
            () => console.log('Stored item!'),
            error => console.error('Error storing item', error)
          );

        this.nativeStorage.getItem('sign_in')
          .then(
            data => console.log(data.active),
            error => console.error(error)
          );
      }
    }, err => {
    });
  }

}
