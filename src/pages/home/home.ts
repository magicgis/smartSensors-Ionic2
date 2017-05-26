import { OnInit, Component , OnDestroy } from '@angular/core';
import { NavParams, NavController, Platform, AlertController  } from 'ionic-angular';
import { Auth, User } from '@ionic/cloud-angular';

import { LocalNotifications } from '@ionic-native/local-notifications';
import * as moment from 'moment';
import { Observable }        from 'rxjs/Observable';

// Observable class extensions
import 'rxjs/add/observable/of';

// Observable operators
import 'rxjs/add/operator/catch';

import { LoginPage } from '../login/login';

import { KnowledgeModel } from '../../models/knowledge.model';
import { DataService } from '../../providers/apiData.service';

import { Packet } from 'mqtt';
import { MQTTService } from '../../providers/mqtt/mqtt.service';
import { ConfigService } from '../../providers/config/config.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit, OnDestroy {

  // Stream of messages
  public messages: Observable<Packet>;

  // Array of historic message (bodies)
  public mq: Array<Packet> = [];

  // A count of messages received
  public count = 0;

  public config = {
      "host": "m11.cloudmqtt.com",
      "port": 31102,
      "path": "",
      "ssl": true,
      "user": "guest",
      "pass": "guest",
      "subscribe": [],
      "publish": [],
      "keepalive": 10
  };

  errorMessage: string;
  selectedItem: any;
  userKey: any;
  userID: any;
  keys: any[];

  notifications: any[] = [];

  ouvintes: Array<number> = [];

  asyncChannels$: Observable<KnowledgeModel[]>;

  // Array of historic channels
  public channels: Array<KnowledgeModel> = [];
  public lookup: Object = {};
  // A count of messages received
  public channel_count = 0;

  viewModel: any = [];
  //heroes: Observable<Hero[]>;
  pushTopic: string = "";
  pushMessage: string = "push message will be displayed here";

  constructor(public navCtrl: NavController,
              public platform: Platform,
              public navParams: NavParams,
              public user:User,
              public auth:Auth,
              public dataService:DataService,
              private localNotifications: LocalNotifications,
              private _mqService: MQTTService,
              private _configService: ConfigService) {
    this.userKey = navParams.get("key");
    console.log(user);
  }

  ngOnInit() {
    // Get configuration from config service...
    this._configService.getConfig('assets/api-config.json').then(
      config => {
        config.user = this.user.id;
        config.pass = this.user.id;
        config.subscribe = [];

        //this.asyncChannels$ = this.dataService.getData(["channel","user", this.userKey]);
        this.dataService.getData(["subscribedBy", this.userKey])
                .subscribe(channels => {
                  //config.subscribe = ["591eea676a040fc9091938d2", "58f3ac46866064c6189ec943","58f3ac46866064c6189ec927"];
                  for (let chan of channels){
                        var id = this.channels.push(chan);
                        config.subscribe.push(chan._id);
                        this.lookup[chan._id] = this.channels[--id];
                  }
                  // ... then pass it to (and connect) the message queue:
                  /*this._mqService.configure(config);
                  this._mqService.try_connect()
                    .then(this.on_connect)
                    .catch(this.on_error);*/
                });
      }
    );
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

  trackByFn(index,item){
     return item.id
  }

  ngOnDestroy() {
    this._mqService.disconnect();
  }


  /** Callback on_connect to queue */
  public on_connect = () => {

    // Store local reference to Observable
    // for use with template ( | async )
    this.messages = this._mqService.messages;

    // Subscribe a function to be run on_next message
    this.messages.subscribe(this.on_next);
  }

  /** Consume a message from the _mqService */
  public on_next = (message: Packet) => {

    // Store message in "historic messages" queue
    this.mq.push(message);

    if (message) {
      this.pushTopic = message["topic"];
      var changedObj = message["payload"];
      this.pushMessage = changedObj.toString();
      if (changedObj.sync > this.lookup[message["topic"]].sync)
        this.lookup[message["topic"]][changedObj.type] = changedObj.item;
    }

    // Count it
    this.count++;
  }

  public on_error = () => {
    console.error('Ooops, error in RawDataComponent');
  }

  /*exitApp(){
    console.log("----------");
    this.platform.exitApp();
  }*/

  selectUserChannels() {
    /*this.dataService.getData(["channel","user", this.userKey])
      .subscribe(this.on_channel);
                       //console.log(JSON.stringify(data));
                       for (let chan of data){
                          this.selectObjects(chan.relations.next);
                          this.selectAssociations(chan.relations.next);
                        }*/
  }

  /** Consume a channel */
  public on_channel = (channel) => {

    // Store channels
    for (let chan of channel){
       this.channels.push(chan);
       // Count it
       this.channel_count++;
    }
  }

  selectObjects(channelId) {
    this.dataService.getData([channelId])
            .subscribe(model => {
              this.channels.push(new KnowledgeModel(model));
            });
  }

  logout() {
    this.auth.logout();
    this.navCtrl.setRoot(LoginPage);
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
}
