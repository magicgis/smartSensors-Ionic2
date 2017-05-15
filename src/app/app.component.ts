import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

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
              public statusBar: StatusBar,
              public splashScreen: SplashScreen,
              public dataService:DataService,
              public user:User,
              public auth:Auth,
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

      if(this.auth.isAuthenticated()) {
        let loader = this.loadingCtrl.create({
          content: "Logging in..."
        });
        loader.present();
        this.dataService.getStaticData(["knowledge", "data", "data.email", this.user.details.email], "key")
              .then(value => {
                this.userKey  = value[0].key, this.userID  = value[0]._id
                loader.dismissAll();
                this.nav.setRoot(HomePage, {"key": this.userKey, "id": this.userID})
              },error =>  this.errorMessage = <any>error);
      }else{
        this.nav.setRoot(LoginPage);
      }
      // We subscribe to the dismiss observable of the service

    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.push(page.component, {"key": this.userKey, "id": this.userID});
  }

}
