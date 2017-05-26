import { Component, ViewChild } from '@angular/core';
import { Events, AlertController, Nav, Platform } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Push, PushObject, PushOptions } from "@ionic-native/push";
//import { Storage } from '@ionic/storage';

import { DataService } from '../providers/apiData.service';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { EquipmentsPage } from '../pages/equipments/equipments';
import { AccessoryPage } from '../pages/accessory/accessory';
import { SourcePage } from '../pages/source/source';
import { HubPage } from '../pages/hub/hub';
import { User, Auth } from '@ionic/cloud-angular';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;
  userKey: any;
  userID: any;
  errorMessage: string;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform,
          		private events: Events,
          		//private storage: Storage,
              private statusBar: StatusBar,
          		private splashScreen: SplashScreen,
              public push: Push,
              public dataService:DataService,
              public user:User,
              public auth:Auth,
              public alertCtrl: AlertController,
              public loadingCtrl:LoadingController) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Perfil', component: ProfilePage },
      { title: 'Acessórios', component: AccessoryPage },
      { title: 'Sensores', component: SourcePage },
      { title: 'Hub', component: HubPage },
      { title: 'Equipamentos', component: EquipmentsPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.initPushNotification();

      if(this.auth.isAuthenticated()) {
        let loader = this.loadingCtrl.create({
          content: "Logging in..."
        });
        loader.present();
        this.dataService.getStaticData(["data", "data.email", this.user.details.email], "owner")
              .then(value => {
                this.userKey  = value[0].owner, this.userID  = value[0]._id
                loader.dismissAll();
                this.nav.setRoot(HomePage, {"key": this.userID, "id": this.userID})
              },error =>  this.errorMessage = <any>error);
      }else{
        this.nav.setRoot(LoginPage);
      }
      // We subscribe to the dismiss observable of the service

    });
  }

  listenToLoginEvents() {
		this.events.subscribe('user:login', () => {
			// this.navCtrl.push(HomePage)
			// this.navCtrl.setRoot(HomePage);
		})

		this.events.subscribe('user:logout', () => {
			console.log('user:logout')
		})
	}

  initPushNotification(){
    if (!this.platform.is('cordova')) {
      console.warn("Push notifications not initialized. Cordova is not available - Run in physical device");
      return;
    }

    const options: PushOptions = {
      android: {
        senderID: "998257253122"
      },
      ios: {
        alert: "true",
        badge: false,
        sound: "true"
      },
      windows: {}
    };
    const pushObject: PushObject = this.push.init(options);

    pushObject.on('registration').subscribe((data: any) => {
      console.log("device token -> " + data.registrationId);
      //TODO - send device token to server
    });

    pushObject.on('notification').subscribe((data: any) => {
      console.log('message', data.message);
      //if user using app and push notification comes
      if (data.additionalData.foreground) {
        // if application open, show popup
        let confirmAlert = this.alertCtrl.create({
          title: 'New Notification',
          message: data.message,
          buttons: [{
            text: 'Ignore',
            role: 'cancel'
          }]
        });
        confirmAlert.present();
      } else {
        console.log("Push notification clicked");
      }
    });

    pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.push(page.component, {"key": this.userID, "id": this.userID});
  }

}
