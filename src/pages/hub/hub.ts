import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, NavController, ViewController } from 'ionic-angular';
import { Observable }        from 'rxjs/Observable';
// Observable operators
import 'rxjs/add/operator/catch';

import { HubDetailsPage } from '../hub-details/hub-details';
import { ModalContentPage }  from '../hub/hubModal';

import { DataService } from '../../providers/apiData.service';
import { User } from '@ionic/cloud-angular';

@Component({
  selector: 'page-hub',
  templateUrl: '../templates/list-page.html'
})
export class HubPage implements OnInit {
  pageTitle: string = "Hubs";
  imgdef:string = "assets/icons/img/ionic.png";
  shouldShowDelete:boolean = false;
  listed:boolean = false;

  errorMessage: string;
  selectedItem: any;
  userKey: any;
  objects: any[];
  filteredItems: any[];

  newItemWindow: Object = {
    title: "Novo Objeto",
    mensagem: "Qual o nome do objeto?",
    create: "Criar Objeto"
  };

  constructor(public user:User,
              public navCtrl: NavController,
              public navParams: NavParams,
              public dataService:DataService) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
    this.userKey = navParams.get('key');
  }

  // Push a search term into the observable stream.
  getItems(term: string) {
    // Reset items back to all of the items
    //this.initializeItems();
    // if the value is an empty string don't filter the items
    if (term.trim() == '') {
      return;
    }
    this.filteredItems = this.objects.filter((v) => {
      if (v.data["next"]["type"].toLowerCase().indexOf(term.toLowerCase()) > -1) return true;
        return false;
    })
  }

  ngOnInit() { this.getObjects(); }

  getObjects() {
    this.dataService.getData(["knowledge", "object", "sink" , this.userKey])
                     .subscribe(
                       data => this.objects = data,
                       error =>  this.errorMessage = <any>error);
  }

  addHub(item) {
    if (!item) { return; }
    this.dataService.createObject(item)
                .subscribe(
                  data  => this.objects.push(data),
                  error =>  this.errorMessage = <any>error);
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

  removeItem(event: any, itemId){
    this.dataService.removeData(itemId)
  }

  itemTapped(event: any, itemId: string) {
    this.navCtrl.push(HubDetailsPage, {
        item: itemId,
        key: this.userKey
    });
  }
}
