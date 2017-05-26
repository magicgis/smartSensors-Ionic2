import { Component } from '@angular/core';
import { ModalController,NavController, NavParams, Platform, ActionSheetController } from 'ionic-angular';

import { ChooseItemModal }  from '../choose-item-modal/choose-item-modal';

import { TopicDesignerPage } from '../topic-designer/topic-designer';
import { CreateKnowledgePage } from '../create-knowledge/create-knowledge';

import { DataService } from '../../providers/apiData.service';
import { User } from '@ionic/cloud-angular';


@Component({
  selector: 'page-topic',
  templateUrl: '../templates/list-page.html'
})
export class TopicPage {
  pageTitle: string = "Automação";
  imgdef:string = "assets/icons/img/ionic.png";
  shouldShowDelete:boolean = false;
  listed:boolean = false;

  selectedItem: any;
  userKey: any;
  objects: Array<{}>;

  newItemWindow: Object = {
    title: "Novo Objeto",
    mensagem: "Qual o nome do objeto?",
    create: "Criar Objeto"
  };

  shouldAnimate: boolean = true;

  constructor(public user:User,
              public navCtrl: NavController,
              public navParams: NavParams,
              public platform: Platform,
              public actionsheetCtrl: ActionSheetController,
              public modalCtrl: ModalController,
              public dataService:DataService) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
    this.userKey = navParams.get('key');
  }

  /*ngOnInit() {
        this.dataService.findAll(["object", "sink", "all"]).subscribe(
            data => this.objects = data
        );
  }*/

  ionViewDidLoad() {
    this.dataService.getData(["topic" , "ownedBy", this.userKey]).subscribe((objects: any[]) => {
      this.objects = objects;
    });
  }

  toggleList(){this.listed = !this.listed};
  toggleDelete(){this.shouldShowDelete = !this.shouldShowDelete};

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
  startItem(event: any, itemIndex: number){


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

  remove(event: any, itemIndex: number){

  }

  itemTapped(event: any, itemId: string) {
    this.navCtrl.push(TopicDesignerPage, {
        item: itemId,
        key: this.userKey
    });
  }

  openMenu() {
    let actionSheet = this.actionsheetCtrl.create({
      title: 'Tópicos',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Novo Tópico',
          icon: !this.platform.is('ios') ? 'arrow-dropright-circle' : null,
          handler: () => {
            let modal = this.modalCtrl.create(ChooseItemModal, {key: this.userKey, listType: 'equipment', itemType: 'topic', title: 'Novo Tópico'});
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
          text: 'Cancel',
          role: 'cancel', // will always sort to be on the bottom
          icon: !this.platform.is('ios') ? 'close' : null,
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }
}
