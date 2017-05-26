import { Component } from '@angular/core';
import { ModalController, NavController, NavParams } from 'ionic-angular';
import { ModalContentPage }  from '../modals/attribute-item';

import { DataService } from '../../providers/apiData.service';
import { User } from '@ionic/cloud-angular';

import { AccessoryDetailsPage } from '../accessory-details/accessory-details';
import { SourceDetailsPage } from '../source-details/source-details';
import { ProfilePage } from '../profile/profile';
import { CreateKnowledgePage } from '../create-knowledge/create-knowledge';

import { DataInterface } from '../../models/data.interface';
import { AttributeModel } from '../../models/attribute.model';
import { KnowledgeModel } from '../../models/knowledge.model';

@Component({
  selector: 'page-hub-details',
  templateUrl: '../templates/details-page.html'
})
export class HubDetailsPage {
  pageTitle: string;
  imgdef:string = "assets/icons/img/ionic.png";
  listAttributes: boolean = false;
  listConfigurations: boolean = false;
  update: boolean = false;

  errorMessage: string;
  selectedItem: any;
  userKey: any;

  object: KnowledgeModel;
  configurations: Array<AttributeModel> = [];

  data: DataInterface;
  info: Array<AttributeModel> = [];
  knowledges: Array<KnowledgeModel> = [];
  changed: boolean[];

  constantsWindows: Object = {
    newItemWindow: {
      title: "Nova Associação",
      mensagem: "Qual o nome da associação?"
    },
    create: "Criar Associação",
    update: "Salvar"
  };

   shouldAnimate: boolean = true;

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
    this.dataService.getOne([ this.selectedItem])
                     .subscribe(result => {
                       this.pageTitle  = result.data.name;
                       this.info = result.data.info;
                       this.configurations = result.data.configurations;
                       this.data = result.data;
                       this.object = new KnowledgeModel(result);
                     },error =>  this.errorMessage = <any>error);
  }

  selectAssociations() {
    this.dataService.getData(["connectedTo", this.selectedItem])
                  .subscribe((objects: any[]) => {
      this.knowledges = objects;
    });
  }

  transformDate(date){
    return new Date(date).toLocaleString();
  }

  propertyTapped(event, item) {
      /*this.navCtrl.push(HubDetailsPage, {
          item: item
      });*/
  }

  updateItem() {
    this.navCtrl.push(CreateKnowledgePage, {
        item: this.selectedItem,
        key: this.userKey
    });
  }

  editItem(event: any, itemIndex: number){
  }
  enableItem(event: any, itemIndex: number){
  }

  removeItem(event: any, itemId){
    this.dataService.removeKnowledge(itemId);
  }

  toggleUpdateAttr(evt, ref, item){
    if(evt.checked !== this.data[ref][item])
      this.updateAttribute(["data", ref, item].join("."), this.data[ref][item]);
      //this.changed[ref + item]=! this.changed[ref + item];
  }

  addAssociation(){

  }

  openModal(type, ref) {
    let modal = this.modalCtrl.create(ModalContentPage);
    modal.present();
    modal.onWillDismiss((data: any) => {
      if (data) {
        console.log('MODAL DATA', data);
        if (type==='add') {
          var index = this.object.data[ref].push(data.item);
          this.updateAttribute(["data", ref].join("."), index);
        }
        this.updateAttribute(["data", ref].join("."), this.object[ref][index]);
      }
    });
  }


  updateAttribute(ref, item){
    //let changes = {};
    //changes[ref + item] = this.values[ref + item];
    this.dataService.updateAttribute(this.selectedItem, {ref: item})
          .subscribe((data: any) => {
            console.log(data['ok']);
          });
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

    if (item.type === "sensor") nextPage = SourceDetailsPage;
    else if (item.type === "actuator") nextPage = AccessoryDetailsPage;
    else nextPage = ProfilePage;

    this.navCtrl.push(nextPage, {
        item: item._id,
        key: this.userKey
    });
  }
}
