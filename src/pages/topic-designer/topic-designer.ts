import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, NavController, NavParams, PopoverController } from 'ionic-angular';
import { NativeGeocoder } from '@ionic-native/native-geocoder'

import { ShowMapModal }  from '../modals/show-map-modal';

import { DataService } from '../../providers/apiData.service';
import { User } from '@ionic/cloud-angular';

import { ItemPopOverPage } from './item-popover';

import { AssociationModel, EquipmentModel, KnowledgeModel, TopicModel } from '../../models/interfaces';
import { RelationModalPage } from '../modals/relation-item-modal';
import { RuleModalPage } from '../modals/rule-item-modal';


@Component({
  selector: 'page-topic-designer',
  templateUrl: './topic-designer-page.html'
})
export class TopicDesignerPage implements OnInit{

  pageTitle: string;
  imgdef: string = "assets/icons/img/ionic.png";

  listRules: boolean = false;
  listActions: boolean = false;
  listed: boolean = false;
  shouldAnimate: boolean = false;

  selectedSegment: string = "rules";
  errorMessage: string;
  selectedItem: any;
  userKey: any;

  dynamic: boolean = false;

  object: KnowledgeModel<TopicModel, AssociationModel>;

  constructor(public user:User,
              public navCtrl: NavController,
              public modalCtrl: ModalController,
              public nativegeocoder: NativeGeocoder,
              public loadingCtrl: LoadingController,
              public navParams: NavParams,
              private popoverCtrl: PopoverController,
              private dataService:DataService) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
    this.userKey = navParams.get('key');
  }

  ngOnInit() {
    this.dataService
      .getOne<EquipmentModel>([ this.selectedItem])
      .subscribe((result: any) => {
        this.pageTitle  = result.data.name;
        this.object     = result;
        (this.object.category==='dynamic')?this.dynamic=true:this.dynamic=false;
      });
  }

  showMap(){
    let modal = this.modalCtrl.create(ShowMapModal,{ change: true, item: this.object, key: this.userKey });
    modal.present();

    modal.onWillDismiss((data: any) => {
      if (data) {
        this.object.location.coordinates = [data.newLocal.lat, data.newLocal.lng];
        console.log('MODAL DATA', data.newLocal);
        this.nativegeocoder.reverseGeocode(data.newLocal.lat, data.newLocal.lng)
          .then((result)=>{
            alert("The address is: \n\n" + result.street + " " + result.houseNumber + ", " + result.postalCode + " " + result.city + " " + result.district + " in " + result.countryName + " - " + result.countryCode);
          }).catch((err)=>{
            alert(JSON.stringify(err));
          });
      }
    });
  }

  onSubmit() {
    let loader = this.loadingCtrl.create({
      content: "Salvando..."
    });
    loader.present();

    if (!this.object._id)
      this.dataService.createKnowledge(this.object)
        .subscribe(
          data => {
            console.log ( data );
            loader.dismissAll();
            this.navCtrl.pop();
          },
          error =>  this.errorMessage = <any>error
        );
    else
      this.dataService.updateKnowledge(this.object._id, this.object)
        .subscribe(
          data => {
            console.log ( data );
            loader.dismissAll();
            this.navCtrl.pop();
          },
          error =>  this.errorMessage = <any>error
        );
  }

  saveObject(){

  }

  changeImage(){}

  changeIcon(){}

  toggleList(){this.listed = !this.listed};

  propertyTapped(event, item) {
      /*this.navCtrl.push(HubDetailsPage, {
          item: item
      });*/
  }

  showPopover(myEvent, index) {

    let popover = this.popoverCtrl.create(ItemPopOverPage, {
      items: index
    });

    popover.present({
      ev: myEvent
    });
  }


  newRule(){
    let modal = this.modalCtrl.create(RuleModalPage,{ type: "rule", index: this.object.data.ruleContainer.length });
    modal.present();
    modal.onWillDismiss((data: any) => {
      if (data) {
        console.log('MODAL DATA', data);
        this.object.data.ruleContainer.push(data.item);
      }
    });
  }
  editRule(itemIndex: number){

  }
  removeRule(itemIndex: number){

  }

  newAction(){
    let modal = this.modalCtrl.create(RuleModalPage,{ type: "action" });
    modal.present();
    modal.onWillDismiss((data: any) => {
      if (data) {
        console.log('MODAL DATA', data);
        this.object.data.actionContainer.push(data.item);
      }
    });
  }
  editAction(itemIndex: number){

  }
  removeAction(itemIndex: number){

  }

//  addAssociation(itemId: string, associationType: string, relation: RelationModel){


  addAssociation() {
    let modal = this.modalCtrl.create(RelationModalPage);
    modal.present();
    modal.onWillDismiss((data: any) => {
      if (data) {
        console.log('MODAL DATA', data);
        this.object.relations[data.reltype].push(data.item);
      }
    });
  }

  removeAssociation(associationType: string, relid: string){
    this.dataService.removeAssociation(this.object._id, associationType , relid);
  }

  itemTapped(event, item) {

  }

}
