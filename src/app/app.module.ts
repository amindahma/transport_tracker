import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { BusPage } from '../pages/bus/bus';
import { MapPage } from '../pages/map/map';
import { SignInPage } from '../pages/sign-in/sign-in';
import { TrainPage } from '../pages/train/train';
import { StaffPage } from '../pages/staff/staff';
import { SchoolPage } from '../pages/school/school';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geolocation } from '@ionic-native/geolocation';

import { MqttConnection } from '../module/demo.module';
import { UrlProvider } from '../providers/url/url';
import { ApiProvider } from '../providers/api/api';
import { HttpModule } from '@angular/http';
import { NativeStorage } from '@ionic-native/native-storage';
import { BackgroundMode } from '@ionic-native/background-mode';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { SettingsPage } from '../pages/settings/settings';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    BusPage,
    MapPage,
    SignInPage,
    TrainPage,
    StaffPage,
    SchoolPage,
    SettingsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule
    // IonicPageModule.forChild(MapPage),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    BusPage,
    MapPage,
    SignInPage,
    TrainPage,
    StaffPage,
    SchoolPage,
    SettingsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    MqttConnection,
    Geolocation,
    BackgroundGeolocation,
    NativeStorage,
    BackgroundMode,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UrlProvider,
    ApiProvider
  ]
})
export class AppModule {}
