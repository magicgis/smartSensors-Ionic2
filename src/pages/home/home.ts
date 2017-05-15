import { OnInit, Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Auth, User } from '@ionic/cloud-angular';

import { Observable }        from 'rxjs/Observable';

// Observable class extensions
import 'rxjs/add/observable/of';

// Observable operators
import 'rxjs/add/operator/catch';

import { LoginPage } from '../login/login';

import {KnowledgeModel} from '../../models/knowledge.model';
import { DataService } from '../../providers/apiData.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {

  errorMessage: string;
  selectedItem: any;
  userKey: any;
  userID: any;
  keys: any[];

  ouvintes: number[];
  asyncChannels$: Observable<KnowledgeModel[]>;
  channels: KnowledgeModel[];
  viewModel: any = [];
  //heroes: Observable<Hero[]>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public user:User,
              public auth:Auth,
              public dataService:DataService) {
    console.log(user);
    this.userKey = navParams.get('key');
    this.userID = navParams.get('id');
    this.ouvintes = [];
    this.channels = [];
    this.asyncChannels$ = Observable.of<KnowledgeModel[]>(this.channels);
  }

  ngOnInit() {
    this.selectUserChannels();
  }

  selectUserChannels() {
    this.dataService.getData(["association", "subscribe", "last" , this.userID])
                     .subscribe((data) => {
                       //console.log(JSON.stringify(data));
                       for (let chan of data){
                          this.selectObjects(chan.relations.next);
                          this.selectAssociations(chan.relations.next);
                        }
                     },error =>  this.errorMessage = <any>error);
  }

  selectObjects(channelId) {

    this.dataService.getData(["knowledge", channelId])
            .subscribe(model => {
              this.channels.push(new KnowledgeModel(model));
            });
    /*this.channels = this.dataService.getData(["knowledge", channelId])
                     .subscribe((data: any) => {
                         this.channels.push(data)
                         console.log(JSON.stringify(data));
                       },
                       error =>  this.errorMessage = <any>error);*/
  }

  selectAssociations(channelId) {
    this.dataService.getData(["association", "subscribe", "next" , channelId])
                  .subscribe((data: any[]) => {
                    this.ouvintes[channelId] = data.length;
    });
  }

  logout() {
    this.auth.logout();
    this.navCtrl.setRoot(LoginPage);
  }


}
