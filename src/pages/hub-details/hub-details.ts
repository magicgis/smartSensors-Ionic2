import { Component } from '@angular/core';
import { ActionSheetController, ModalController, NavController, NavParams, Platform } from 'ionic-angular';
import { ModalContentPage }  from '../modals/attribute-item';
import { ShowMapModal }  from '../modals/show-map-modal';

import { DataService } from '../../providers/apiData.service';
import { User } from '@ionic/cloud-angular';

import { AccessoryDetailsPage } from '../accessory-details/accessory-details';
import { SourceDetailsPage } from '../source-details/source-details';
import { ProfilePage } from '../profile/profile';
import { CreateKnowledgePage } from '../create-knowledge/create-knowledge';

import {
  EquipmentModel, KnowledgeModel, AssociationModel, AttributeModel,
  RelationModel
} from '../../models/interfaces';
import { ChooseItemModal } from '../modals/choose-item-modal';
import { TopicDesignerPage } from '../topic-designer/topic-designer';

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

  object: KnowledgeModel<EquipmentModel, AssociationModel>;
  configurations: Array<AttributeModel> = [];

  data: EquipmentModel;
  info: Array<AttributeModel> = [];
  knowledges: Array<KnowledgeModel<EquipmentModel, AssociationModel>> = [];
  changed: boolean[];

  constantsWindows: Object = {
    newItemWindow: {
      title: "Nova Associação",
      mensagem: "Qual o nome da associação?"
    },
    create: "Criar Associação",
    update: "Salvar"
  };

   shouldAnimate: boolean = false;

  constructor(public user:User,
              public navCtrl: NavController,
              public navParams: NavParams,
              public platform: Platform,
              public modalCtrl: ModalController,
              public actionsheetCtrl: ActionSheetController,
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
    this.dataService.getOne<EquipmentModel>([ this.selectedItem])
                     .subscribe((result: KnowledgeModel<EquipmentModel, AssociationModel>) => {
                       this.object = result;
                       this.pageTitle  = this.object.data.name;
                       this.info = this.object.data.info;
                       this.configurations = this.object.data.configurations;
                       this.data = this.object.data;
                     },error =>  this.errorMessage = <any>error);
  }

  selectAssociations() {
    this.dataService.getData(["connectedTo", this.selectedItem],null)
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

  toggleUpdateAttr(evt, ref, item){
    if(evt.checked !== this.data[ref][item])
      this.updateAttribute(["data", ref, item].join("."), this.data[ref][item]);
      //this.changed[ref + item]=! this.changed[ref + item];
  }

  addAssociation(itemId: string, associationType: string, relation: RelationModel){
    this.dataService.addAssociation(itemId, associationType, relation);
  }

  removeAssociation(itemId: string, associationType: string, relid: string){
    this.dataService.removeAssociation(itemId, associationType , relid);
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
  showMap() {
    let modal = this.modalCtrl.create(ShowMapModal,{ items: [].push(this.object), key: this.userKey });
    modal.present();
  }
  itemTapped(event, item) {
    var nextPage:any = null;

    if (item.type === "sensor") nextPage = SourceDetailsPage;
    else if (item.type === "actuator") nextPage = AccessoryDetailsPage;
    else if (item.type === "topic") nextPage = TopicDesignerPage;
    else nextPage = ProfilePage;

    this.navCtrl.push(nextPage, {
        item: item._id,
        key: this.userKey
    });
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

  removeItem(){
    this.dataService.removeKnowledge(this.selectedItem);
  }

  createItem(){
    let modal = this.modalCtrl.create(ChooseItemModal, {key: this.userKey, listType: 'equipment', itemType: 'board', title: 'Novo Hub'});
    modal.present();
    modal.onWillDismiss((data: any) => {
      if (data) {
        this.navCtrl.push(CreateKnowledgePage, {
          template: data.itemTemplate,
          item: "",
          key: this.userKey
        });
        console.log('MODAL DATA', data);
      }
    });
  }

  toggleItemStatus(){
    var body = {
      "boardKeys": [
        {"boardId": this.selectedItem}
      ]
    };

    this.dataService.toggleEquipmentStatus(body, !this.object.data.connected)
      .subscribe(
        (data) => {
          console.log(data)
          this.object.data.connected = data.status;
        },error =>  this.errorMessage = <any>error);
  }

  openMenu() {
    let actionSheet = this.actionsheetCtrl.create({
      title: 'Hubs',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Iniciar',
          icon: !this.platform.is('ios') ? 'play' : null,
          handler: () => {
            this.toggleItemStatus();
          }
        },
        {
          text: 'Novo',
          icon: !this.platform.is('ios') ? 'add' : null,
          handler: () => {
            this.createItem();
          }
        },
        {
          text: 'Editar',
          icon: !this.platform.is('ios') ? 'create' : null,
          handler: () => {
            this.updateItem();
          }
        },
        {
          text: 'Remover',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'trash' : null,
          handler: () => {
            console.log('Delete clicked');
            this.removeItem();
          }
        },
        {
          text: 'Voltar',
          role: 'quit', // will always sort to be on the bottom
          icon: !this.platform.is('ios') ? 'close' : null,
          handler: () => {
            console.log('Sair clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }
}
