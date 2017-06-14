var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { EquipmentsPage } from '../pages/equipments/equipments';
import { AccessoryPage } from '../pages/accessory/accessory';
import { AccessoryDetailsPage } from '../pages/accessory-details/accessory-details';
import { SourcePage } from '../pages/source/source';
import { SourceDetailsPage } from '../pages/source-details/source-details';
import { ChatsPage } from '../pages/chats/chats';
import { ChatsDetailPage } from '../pages/chats/chats-detail';
import { HubPage } from '../pages/hub/hub';
import { ModalContentPage } from '../pages/modals/attribute-item';
import { ShowMapModal } from '../pages/modals/show-map-modal';
import { ChooseItemModal } from '../pages/modals/choose-item-modal';
import { HubDetailsPage } from '../pages/hub-details/hub-details';
import { CreateKnowledgePage } from '../pages/create-knowledge/create-knowledge';
import { GraphPage } from '../pages/graph/graph';
import { MapsPage } from '../pages/maps/maps';
import { GeofenceDetailsPage } from '../pages/geofence/geofence';
import { BarcodePage } from '../pages/barcode/barcode';
import { ItemPopOverPage } from '../pages/topic-designer/item-popover';
import { TopicDesignerPage } from '../pages/topic-designer/topic-designer';
import { TopicPage } from '../pages/topic/topic';
//import { StatusComponent } from '../pages/status/status.component';
import { DataService } from '../providers/apiData.service';
import { FollowersService } from '../providers/followers.service';
import { MQTTService } from '../providers/mqtt/mqtt.service';
import { ConfigService } from '../providers/config/config.service';
import { GeofenceService } from "../providers/geofence.service";
import { LocationTracker } from '../providers/location-tracker';
import { ReversePipe } from '../pipes/reverse.pipe';
import { DerpPipe } from '../pipes/derp.filter';
import { AssociationFilterPipe } from '../pipes/association.filter';
import { AnimateItemSliding } from '../directives/animate-item-sliding';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Camera } from '@ionic-native/camera';
import { Facebook } from '@ionic-native/facebook';
import { BackgroundMode } from '@ionic-native/background-mode';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { SocialSharing } from '@ionic-native/social-sharing';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { IonicStorageModule } from '@ionic/storage';
import { Dialogs } from '@ionic-native/dialogs';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { Geofence } from '@ionic-native/geofence';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Geolocation } from '@ionic-native/geolocation';
import { CloudModule } from '@ionic/cloud-angular';
import { TextMaskModule } from 'angular2-text-mask';
import { RelationModalPage } from '../pages/modals/relation-item-modal';
import { RuleModalPage } from '../pages/modals/rule-item-modal';
var cloudSettings = {
    'core': {
        'app_id': '734dd7bf'
    },
    'auth': {
        'facebook': {
            'scope': []
        }
    }
};
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    NgModule({
        declarations: [
            MyApp,
            HomePage,
            ChatsPage,
            ChatsDetailPage,
            LoginPage,
            ProfilePage,
            EquipmentsPage,
            AccessoryPage,
            AccessoryDetailsPage,
            SourcePage,
            SourceDetailsPage,
            HubPage,
            HubDetailsPage,
            CreateKnowledgePage,
            GeofenceDetailsPage,
            GraphPage,
            TopicPage,
            MapsPage,
            BarcodePage,
            TopicDesignerPage,
            ItemPopOverPage,
            ModalContentPage,
            ChooseItemModal,
            RelationModalPage,
            RuleModalPage,
            ShowMapModal,
            AssociationFilterPipe,
            ReversePipe,
            DerpPipe,
            AnimateItemSliding
        ],
        imports: [
            BrowserModule,
            ReactiveFormsModule,
            FormsModule,
            HttpModule,
            TextMaskModule,
            IonicModule.forRoot(MyApp),
            IonicStorageModule.forRoot(),
            CloudModule.forRoot(cloudSettings)
        ],
        bootstrap: [IonicApp],
        entryComponents: [
            MyApp,
            HomePage,
            LoginPage,
            ProfilePage,
            EquipmentsPage,
            AccessoryPage,
            AccessoryDetailsPage,
            SourcePage,
            SourceDetailsPage,
            HubPage,
            HubDetailsPage,
            ChatsPage,
            ChatsDetailPage,
            CreateKnowledgePage,
            ItemPopOverPage,
            ModalContentPage,
            ChooseItemModal,
            ShowMapModal,
            GeofenceDetailsPage,
            TopicPage,
            GraphPage,
            MapsPage,
            BarcodePage,
            TopicDesignerPage,
            RelationModalPage,
            RuleModalPage
        ],
        providers: [
            StatusBar,
            SplashScreen,
            LocalNotifications,
            Camera,
            DataService,
            Diagnostic,
            FollowersService,
            MQTTService,
            ConfigService,
            Facebook,
            BackgroundMode,
            BarcodeScanner,
            SocialSharing,
            Dialogs,
            InAppBrowser,
            SpeechRecognition,
            Geolocation,
            BackgroundGeolocation,
            NativeGeocoder,
            LocationAccuracy,
            Geofence,
            LocationTracker,
            GeofenceService,
            { provide: ErrorHandler, useClass: IonicErrorHandler }
        ]
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map