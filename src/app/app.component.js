var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from '@angular/core';
import { Events, AlertController, Nav, Platform } from 'ionic-angular';
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
import { TopicPage } from '../pages/topic/topic';
import { ChatsPage } from '../pages/chats/chats';
import { MapsPage } from '../pages/maps/maps';
import { HubPage } from '../pages/hub/hub';
import { BarcodePage } from '../pages/barcode/barcode';
import { User, Auth } from '@ionic/cloud-angular';
import { GeofenceDetailsPage } from "../pages/geofence/geofence";
//import { GraphPage } from '../pages/graph/graph';
//import { Storage } from '@ionic/storage';
var MyApp = (function () {
    //private userProfile: Array<Object>;
    function MyApp(platform, events, statusBar, splashScreen, dataService, user, auth, alertCtrl, loadingCtrl) {
        this.platform = platform;
        this.events = events;
        this.statusBar = statusBar;
        this.splashScreen = splashScreen;
        this.dataService = dataService;
        this.user = user;
        this.auth = auth;
        this.alertCtrl = alertCtrl;
        this.loadingCtrl = loadingCtrl;
        this.rootPage = LoginPage;
        this.initializeApp();
        // used for an example of ngFor and navigation
        this.pages = [
            { title: 'Novidades', component: HomePage },
            { title: 'Meus Canais', component: ChatsPage },
            { title: 'Tópicos', component: TopicPage },
            { title: 'Acessórios', component: AccessoryPage },
            { title: 'Sensores', component: SourcePage },
            { title: 'Hubs', component: HubPage },
            { title: 'Equipamentos', component: EquipmentsPage },
            //{ title: 'Graph', component: GraphPage },
            { title: 'Mapas', component: MapsPage },
            { title: 'Geofence', component: GeofenceDetailsPage },
            { title: 'Barcodes', component: BarcodePage },
            { title: 'Perfil', component: ProfilePage }
        ];
    }
    MyApp.prototype.initializeApp = function () {
        var _this = this;
        this.platform.ready().then(function () {
            _this.statusBar.styleDefault();
            _this.splashScreen.hide();
            if (_this.auth.isAuthenticated()) {
                var loader_1 = _this.loadingCtrl.create({
                    content: "Conectando..."
                });
                loader_1.present();
                _this.dataService.getStaticData(["data", "data.email", _this.user.details.email], "owner")
                    .then(function (value) {
                    _this.userKey = value[0]._id;
                    loader_1.dismissAll();
                    _this.nav.setRoot(HomePage, { "key": _this.userKey });
                }, function (error) { return _this.errorMessage = error; });
            }
            else {
                _this.nav.setRoot(LoginPage);
            }
        });
    };
    MyApp.prototype.listenToLoginEvents = function () {
        this.events.subscribe('user:login', function () {
            // this.navCtrl.push(HomePage)
            // this.navCtrl.setRoot(HomePage);
        });
        this.events.subscribe('user:logout', function () {
            console.log('user:logout');
        });
    };
    MyApp.prototype.openPage = function (page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.nav.setRoot(page.component, { "key": this.userKey });
    };
    return MyApp;
}());
__decorate([
    ViewChild(Nav),
    __metadata("design:type", Nav)
], MyApp.prototype, "nav", void 0);
MyApp = __decorate([
    Component({
        templateUrl: 'app.html'
    }),
    __metadata("design:paramtypes", [Platform,
        Events,
        StatusBar,
        SplashScreen,
        DataService,
        User,
        Auth,
        AlertController,
        LoadingController])
], MyApp);
export { MyApp };
//# sourceMappingURL=app.component.js.map