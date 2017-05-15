import { Component } from '@angular/core';
import { ModalController, NavController, NavParams } from 'ionic-angular';
import { ModalContentPage }  from '../templates/attributeModal';

import { DataService } from '../../providers/apiData.service';
import { User } from '@ionic/cloud-angular';

import { AccessoryDetailsPage } from '../accessory-details/accessory-details';
import { SourceDetailsPage } from '../source-details/source-details';



@Component({
  selector: 'page-hub-details',
  templateUrl: '../templates/details-page.html'
})
export class HubDetailsPage {
  pageTitle: string;
  imgdef:string = "assets/icons/img/ionic.png";
  listed: boolean = false;

  errorMessage: string;
  selectedItem: any;
  userKey: any;

  values: any;
  object: any;
  properties: any;
  associations: any;
  changed: boolean[];

  constantsWindows: Object = {
    newItemWindow: {
      title: "Nova Associação",
      mensagem: "Qual o nome da associação?"
    },
    create: "Criar Associação",
    update: "Salvar"
  };

  constructor(public user:User,
              public navCtrl: NavController,
              public navParams: NavParams,
              public modalCtrl: ModalController,
              private dataService:DataService) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
    this.userKey = navParams.get('key');
    this.changed = [];
  }

  ngOnInit() {
    this.selectObject();
    this.selectAssociations();
  }

  selectObject() {
    this.dataService.getOne(["knowledge", this.selectedItem])
                     .subscribe(result => {
                       this.pageTitle  = result.data.name;
                       this.properties = Object.keys(result.data);
                       this.values     = result.data;
                       this.object     = result;
                     },error =>  this.errorMessage = <any>error);
  }

  selectAssociations() {
    this.dataService.getData(["association", "connected", "last" , this.selectedItem])
                  .subscribe((objects: any[]) => {
      this.associations = objects;
    });
  }

  toggleList(){this.listed = !this.listed};

  propertyTapped(event, item) {
      /*this.navCtrl.push(HubDetailsPage, {
          item: item
      });*/
  }

  editItem(event: any, itemIndex: number){

  }
  enableItem(event: any, itemIndex: number){

  }

  removeItem(event: any, itemId){
    this.dataService.removeData(itemId);
  }

  toggleUpdateAttr(item){
    this.changed[item]=!this.changed[item];
  }

  openModal() {
    let modal = this.modalCtrl.create(ModalContentPage);
    modal.present();
    modal.onWillDismiss((data: any) => {
      if (data) {
        console.log('MODAL DATA', data);
        this.values[data.name] = data.attribute;
        this.updateAttribute(data.name);
        //this.excludeTracks = data;
        //this.updateSchedule();
      }
    });
  }


  updateAttribute(item){
    let changes = {};
    changes[item] = this.values[item];
    this.dataService.updateAttribute(this.selectedItem, changes)
          .subscribe((data: any) => {
            console.log(data['ok']);
          });
    this.changed[item]=false;
  }

  removeAttribute(item){
    this.dataService.removeAttribute(this.selectedItem, item)
        .subscribe((data: any) => {
          console.log(data['ok']);
          this.selectObject();
        });
  }

  itemTapped(event, item) {
    var nextPage:any = null;
    if (item["data"]["next"]["type"] === "sensor")
        nextPage = SourceDetailsPage;
    else nextPage = AccessoryDetailsPage;

    this.navCtrl.push(nextPage, {
        item: item["relations"]["next"],
        key: this.userKey
    });
  }
}
