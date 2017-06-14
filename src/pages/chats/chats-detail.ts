import { Component, OnDestroy } from '@angular/core';
import { NavParams, NavController, Platform, AlertController  } from 'ionic-angular';
import { Auth, User } from '@ionic/cloud-angular';

import { Storage } from '@ionic/storage';

import { LocalNotifications } from '@ionic-native/local-notifications';
import { DataService } from '../../providers/apiData.service';

import { SocialSharing } from '@ionic-native/social-sharing';
import { SpeechRecognition } from '@ionic-native/speech-recognition';

import {
  AddressModel,
  KnowledgeMessageModel,
  RelationModel, SyncObjectModel, AssociationModel, KnowledgeModel, ProfileModel, MessageModel, EquipmentModel,
  KnowledgeChannelModel
} from '../../models/interfaces'

@Component({
  selector: 'page-chats-detail',
  templateUrl: 'chats-detail.html'
})
export class ChatsDetailPage implements OnDestroy {

  pageTitle: string = "";
  userKey: string;
  op: string = "$gt";
  inputMsg: string = "";

  channel: KnowledgeModel<EquipmentModel, AssociationModel>;
  channelMsgs: SyncObjectModel<KnowledgeChannelModel> = new SyncObjectModel<KnowledgeChannelModel>();
  listSubscriptions: SyncObjectModel<KnowledgeModel<ProfileModel, AssociationModel>>;

  speeachAvailable: boolean = false;
  notifications: any[] = [];

  constructor(public navCtrl: NavController,
              public platform: Platform,
              public navParams: NavParams,
              public user:User,
              public auth:Auth,
              public alertCtrl: AlertController,
              public dataService:DataService,
              private localNotifications: LocalNotifications,
              private socialSharing: SocialSharing,
              private speechRecognition: SpeechRecognition,
              public storage: Storage) {

    this.userKey = navParams.get("key");
    this.channel = navParams.get("channel");
    this.pageTitle = this.channel.data.name;

    if (this.platform.is('cordova')) {
      this.speechRecognition.isRecognitionAvailable ()
        .then ( ( available: boolean ) => {
          console.log ( available )
          if ( ! available ) {
            this.speeachAvailable = available;
            return;
          }
          // Check permission
          this.speechRecognition.hasPermission ()
            .then ( ( hasPermission: boolean ) => {
              console.log ( hasPermission );
              if ( ! hasPermission )
                this.speechRecognition.requestPermission ()
                  .then ( () => {
                    this.speeachAvailable = true;
                    console.log ( 'Granted' );
                  }, () => {
                    this.speeachAvailable = false;
                    console.log ( 'Denied' )
                  } )
              else this.speeachAvailable = hasPermission;
            } );
        } )
    }

    this.getData();
  }

  ngOnDestroy(){
    this.storage.remove("channelOpen" + this.userKey).then((channel) => {
      console.log ("removed: ", channel );
    });
  }

  getData(){
    this.storage.get("channelOpen" + this.userKey).then((channel) => {
      console.log(channel);
      this.channel = channel;
      this.pageTitle = this.channel.data.name;
      this.storage.get("channelMsgs" + channel._id + this.userKey).then((msgs) => {
        if (msgs) {
          this.channelMsgs = msgs;
          this.getMsgs(channel._id, this.channelMsgs['sync']);
        }else this.getMsgs(channel._id, 0);
      });
    });
  }

  getMsgs(channelId, sync){
    var query = [];

    if (sync) query.push('sync='+ sync);

    this.dataService.getMessengerData([ "connectedTo", channelId ], query )
      .subscribe ( msgData => {
        for ( let msg of msgData )
            this.channelMsgs['objects'].push(msg);

        this.channelMsgs['sync'] = this.channelMsgs['objects'][this.channelMsgs['objects'].length-1]["sync"];
        this.storage.set("channelMsgs" + channelId + this.userKey, this.channelMsgs);
      });
  }

  publishMessage(channelId){
    var body: KnowledgeMessageModel;

    body = this.fillBody(channelId);

    this.dataService.publishMessage(body);
  }

  fillBody(channelId){
    var item: KnowledgeModel<MessageModel, AssociationModel>;

    item.type = 'action';
    item.category = 'message';
    item.root = channelId;
    item.location = this.getGeo();
    item.data.message = this.inputMsg;
    item.data.enabled = true;
    item.data.comments = 0;
    item.data.dislikes = 0;
    item.data.likes = 0;
    item.data.profile = this.userKey;

    var userRelation: RelationModel;
    userRelation.id = this.userKey;
    userRelation.view = true;
    userRelation.publish = true;
    item.relations.ownedBy.push(userRelation);

    var channelRelation: RelationModel;
    channelRelation.id = channelId;
    channelRelation.view = true;
    channelRelation.publish = true;
    item.relations.connectedTo.push(channelRelation);

    item.relations.subscribedBy = this.channel.relations.subscribedBy;

    return new KnowledgeMessageModel(item);
  }

  getGeo(){
    var geo: AddressModel;

    geo.type = "Point";
    geo.text = "";
    geo.coordinates = [0, 0];

    return geo;
  }

  doSpeech(){

    if (!this.speeachAvailable) {
      console.log("Speech not available");
      return;
    }

    let options = {
      language: "pt-BR",
      matches: 1
    }

    // Start the recognition process
    this.speechRecognition.startListening(options)
      .subscribe(
        (matches: Array<string>) => console.log(matches),
        (onerror) => console.log('error:', onerror)
      )

  }

  stopSpeech(){
    // Stop the recognition process (iOS only)
    this.speechRecognition.stopListening();
  }

  share(info) {

    let alert = this.alertCtrl.create();
    alert.setTitle('Compartilhar alerta');

    alert.addInput({
      type: 'string',
      name: 'msg',
      label: 'Mensagem'
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Face',
      handler: data => {
        console.log('Face data:', data);
        this.shareFacebook(info, data.msg);
      }
    });
    alert.addButton({
      text: 'Whats',
      handler: data => {
        console.log('Whats data:', data);
        this.shareWhats(info, data.msg);
      }
    });
    alert.present();
  }

  shareFacebook(info, message){
    // Check if sharing via email is supported
    this.socialSharing.shareViaFacebook(
      message,
      info.data.image
    ).then(() => { }).catch(() => {
      // Sharing via face is not possible
    });
  }

  shareWhats(info, message){
    // Check if sharing via email is supported
    this.socialSharing.shareViaWhatsApp(
      message,
      info.data.image
    ).then(() => {}).catch(() => {
      // Sharing via Whats is not possible
    });
  }

  addNotifications(){

    let firstNotificationTime = new Date();
    firstNotificationTime.setSeconds(firstNotificationTime.getSeconds() + 10);

    let notification = {
        id: 1,
        title: 'Hey!',
        text: 'You just got notified :)',
        at: firstNotificationTime,
        data: { secret: this.userKey }
    };

    this.notifications.push(notification);

    console.log("Notifications to be scheduled: ", this.notifications);

    if(this.platform.is('cordova')){

        // Cancel any existing notifications
        this.localNotifications.cancelAll().then(() => {

            // Schedule the new notifications
            this.localNotifications.schedule(this.notifications);

            this.notifications = [];

        });
    }

  }

  cancelAll(){

      this.localNotifications.cancelAll();

  }

  trackBySync(index,item){
    return item.sync;
  }
  changed(item){

    var now = Date.now();
    var diffMs = (now - item);
    var diffTime = Math.floor(diffMs / 86400000); // days
    if (diffTime>0) return diffTime;
    diffTime = Math.floor((diffMs % 86400000) / 3600000); // hours
    if (diffTime>0) return diffTime;
    return Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
  }
}
