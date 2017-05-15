import { Component, OnInit } from '@angular/core';
import { Platform , NavController, NavParams} from 'ionic-angular';
import { User } from '@ionic/cloud-angular';
import { Observable }        from 'rxjs/Observable';
// Observable operators
import 'rxjs/add/operator/catch';

//import { AssociationFilterPipe } from '../pipes/association.filter'

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
  selectedItem: any;
  equipments:  KnowledgeModel[];

  filteredItems:  KnowledgeModel[];
  imgdef:string = "assets/icons/img/ionic.png";

  equipTitle: string = "equipamentos";
  isAndroid: boolean = false;
  userKey: any;

  constructor(public user:User,
              platform: Platform,
              public navCtrl: NavController,
              navParams: NavParams,
              public dataService:DataService) {
    // If we navigated to this page, we will have an item available as a nav param
    this.isAndroid = platform.is('android');
    this.userKey = navParams.get('key');
    this.selectedItem = "sink";
    this.equipments = [];
  }

  // Push a search term into the observable stream.
  getItems(selectedItem: string) {
    this.filteredItems = this.equipments.filter((v) => {
      if (v.subtype.toLowerCase().indexOf(this.selectedItem.toLowerCase()) > -1) return true;
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
          ? this.dataService.getData(["knowledge", "association", "own" , this.userKey])
          // or the observable of empty heroes if there was no search term
          : Observable.of<any[]>([]))
        .catch(error => {
          // TODO: add real error handling
          console.log(error);
          return Observable.of<any[]>([]);
        });*/
    this.dataService.getData(["knowledge", "type", "object" , this.userKey])
                     .subscribe(
                       data => this.equipments = data,
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
  startItem(event: any, itemId){


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

  editItem(event, item){

  }

  itemTapped(event, item) {
    var nextPage:any = null;
    if (item.subtype === "sensor")
      nextPage = SourceDetailsPage;
    else if (item.subtype === "actuator")
      nextPage = AccessoryDetailsPage;
    else nextPage = HubDetailsPage;

    this.navCtrl.push(nextPage, {
        item: item.id,
        key: this.userKey
    });
  }
}
