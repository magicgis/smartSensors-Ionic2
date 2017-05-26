import { Component, OnInit } from '@angular/core';
import { ModalController,NavController, NavParams, Platform, ActionSheetController } from 'ionic-angular';
import { User } from '@ionic/cloud-angular';
import { Observable }        from 'rxjs/Observable';
// Observable operators
import 'rxjs/add/operator/catch';

//import { AssociationFilterPipe } from '../pipes/association.filter'

import { ChooseItemModal }  from '../choose-item-modal/choose-item-modal';
import { CreateKnowledgePage } from '../create-knowledge/create-knowledge';
import { AccessoryDetailsPage } from '../accessory-details/accessory-details';
import { SourceDetailsPage } from '../source-details/source-details';
import { HubDetailsPage } from '../hub-details/hub-details';

import { DataService } from '../../providers/apiData.service';
import {KnowledgeModel} from '../../models/knowledge.model';


@Component({
  selector: 'page-equipments',
  templateUrl: './equipments.html'
})
export class EquipmentsPage  implements OnInit {
  errorMessage: string;
  selectedItem: string;
  knowledges: Array<KnowledgeModel> = [];

  filteredItems: Array<KnowledgeModel> = [];
  imgdef:string = "assets/icons/img/ionic.png";

  equipTitle: string = "equipamentos";
  isAndroid: boolean = false;
  userKey: any;

  constructor(public user:User,
              public platform: Platform,
              public navCtrl: NavController,
              public actionsheetCtrl: ActionSheetController,
              public modalCtrl: ModalController,
              navParams: NavParams,
              public dataService:DataService) {
    // If we navigated to this page, we will have an item available as a nav param
    this.isAndroid = platform.is('android');
    this.userKey = navParams.get('key');
    this.selectedItem = "sink";
  }

  // Push a search term into the observable stream.
  getItems(selectedItem: string) {
    this.filteredItems = this.knowledges.filter((v) => {
      if (v.type.toLowerCase().indexOf(this.selectedItem.toLowerCase()) > -1) return true;
        return false;
    })
  }

  ngOnInit() { this.getEquipments(); }

  getEquipments() {

    /*this.objects = this.searchTerms
        .debounceTime(300)        // wait 300ms after each keystroke before considering the term
        .distinctUntilChanged()   // ignore if next search term is same as previous
        .switchMap(term => term   // switch to new observable each time the term changes
          // return the http search observable
          ? this.dataService.getData(["association", "own" , this.userKey])
          // or the observable of empty heroes if there was no search term
          : Observable.of<any[]>([]))
        .catch(error => {
          // TODO: add real error handling
          console.log(error);
          return Observable.of<any[]>([]);
        });*/
    this.dataService.getData(["ownedBy", this.userKey])
                     .subscribe(
                       data => this.knowledges = data,
                       error =>  this.errorMessage = <any>error);
  }

  startClick(event: any, itemIndex: number){
    /*
    console.log(user);
    console.log($scope.pageTitle);
    $scope.boardModal.show();
    $scope.configurations = {
      hostip: "192.168.0.100",
      hostport: 8001,
      email: user.email,
      object: object,
      serialport: ""
    };
    */
  }
  startItem(event: any, item: any){
    var configurations = {
      hostip: "",
      hostport: "",
      email: "",
      sink: "",
      serialport: "",
    };
    var body = {};

    body["equipmentId"] = item._id;
    body["action"] = 'start';
    body["type"] = this.selectedItem;
    body["data"] ={
      ip: configurations.hostip,
      port: configurations.hostport,
      email: configurations.email,
      sink: configurations.sink,
      serialport: configurations.serialport,
      configurations: item.data.configurations
    };

    this.dataService.startEquipment(body)
                     .subscribe(
                       data => console.log(data),//this.objects = data,
                       error =>  this.errorMessage = <any>error);

    /*(
     socket.emit("startBoard", JSON.stringify({
     ip: vm.hostip,
     port: vm.hostport,
     email: currentUser.email,
     sink: vm.listItems[currentNavItem].$id,
     serialport: ""
     }));
     */

    /*

    $mdDialog.show({
     controller: WaitController,
     parent: angular.element(document.body),
     targetEvent: $event,
     templateUrl: 'app/core/layouts/wait.dialog.templ.html',
     clickOutsideToClose: false,
     openFrom: {
     top: -50,
     width: 30,
     height: 80
     },
     closeTo: {
     left: 1500
     }
     });

     function WaitController($scope, $mdDialog) {
     $scope.hide = function() {vm.status = 'Processado com sucesso.'};
     $scope.close = function(result) {$mdDialog.hide(result)};
     $scope.cancel = function() {vm.status = 'You cancelled the dialog.'};
     };


    // var email = "leoalmeida.rj@gmail.com"; //currentUser.email,
    alert = ApiDataService.startBoard({
      ip: configurations.hostip,
      port: configurations.hostport,
      email: configurations.email,
      sink: configurations.sink,
      serialport: configurations.serialport
    }, cbStartBoardSuccess, cbStartBoardError);

    */
  }

  removeItem(event: any, itemId){
    this.dataService.removeKnowledge(itemId)
  }

  editItem(event, item){

  }

  itemTapped(event, item) {
    var nextPage:any = null;
    if (item.type === "sensor")
      nextPage = SourceDetailsPage;
    else if (item.type === "actuator")
      nextPage = AccessoryDetailsPage;
    else nextPage = HubDetailsPage;

    this.navCtrl.push(nextPage, {
        item: item._id,
        key: this.userKey
    });
  }

  openMenu() {
    let actionSheet = this.actionsheetCtrl.create({
      title: 'Equipamentos',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Novo Equipamento',
          icon: !this.platform.is('ios') ? 'arrow-dropright-circle' : null,
          handler: () => {
            let modal = this.modalCtrl.create(ChooseItemModal, {key: this.userKey, listType: 'equipment', title: 'Novo Equipamento'});
            modal.present();
            modal.onWillDismiss((data: any) => {
              if (data) {
                this.navCtrl.push(CreateKnowledgePage, {
                    template: data.selectedItem,
                    type: data.selectedType,
                    item: "",
                    key: this.userKey
                });
                console.log('MODAL DATA', data);
              }
            });
          }
        },
        {
          text: 'Remover items',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'trash' : null,
          handler: () => {
            console.log('Delete clicked');
          }
        },
        {
          text: 'Sair',
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
