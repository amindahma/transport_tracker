import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BackgroundMode } from '@ionic-native/background-mode';

/**
 * Generated class for the StaffPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-staff',
  templateUrl: 'staff.html',
})
export class StaffPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private backgroundMode: BackgroundMode) {
    this.backgroundMode.enable();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StaffPage');
  }

}
