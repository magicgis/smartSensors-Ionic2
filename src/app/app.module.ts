import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { EquipmentsPage } from '../pages/equipments/equipments';
import { AccessoryPage } from '../pages/accessory/accessory';
import { AccessoryDetailsPage } from '../pages/accessory-details/accessory-details';
import { SourcePage } from '../pages/source/source';
import { SourceDetailsPage } from '../pages/source-details/source-details';
import { HubPage } from '../pages/hub/hub';
import { ModalContentPage } from '../pages/modals/attribute-item';
import { ChooseItemModal } from '../pages/choose-item-modal/choose-item-modal';
import { HubDetailsPage } from '../pages/hub-details/hub-details';
import { CreateKnowledgePage } from '../pages/create-knowledge/create-knowledge';

import { StatusComponent } from '../pages/status/status.component';


import { DataService } from '../providers/apiData.service';
import { FollowersService } from '../providers/followers.service';
import { MQTTService } from '../providers/mqtt/mqtt.service';
import { ConfigService } from '../providers/config/config.service';

import { KnowledgeModel } from '../models/knowledge.model'
import { AssociationModel } from '../models/association.model'
import { RelationModel } from '../models/relation.model'
import { BasicObjectModel } from '../models/basic-object.model'
import { ObjectModel } from '../models/object.model'

import { ReversePipe } from '../pipes/reverse.pipe'
import { DerpPipe } from '../pipes/derp.filter'
import { AssociationFilterPipe } from '../pipes/association.filter'

import { AnimateItemSliding } from '../directives/animate-item-sliding'


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Push } from "@ionic-native/push";
import { LocalNotifications } from '@ionic-native/local-notifications';

import { CloudSettings, CloudModule } from '@ionic/cloud-angular';


const cloudSettings: CloudSettings = {
  'core': {
    'app_id': '734dd7bf'
  },
  'auth': {
    'facebook': {
      'scope': []
    }
  }
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
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
    ModalContentPage,
    ChooseItemModal,
    StatusComponent,
    AssociationFilterPipe,
    ReversePipe,
    DerpPipe,
    AnimateItemSliding
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    CloudModule.forRoot(cloudSettings)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
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
    ModalContentPage,
    ChooseItemModal
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Push,
    LocalNotifications,
    DataService,
    FollowersService,
    MQTTService,
    ConfigService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
