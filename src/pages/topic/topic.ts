import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { TopicDesignerPage } from '../topic-designer/topic-designer';

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

  constructor(public user:User,
              public navCtrl: NavController,
              public navParams: NavParams,
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
    this.dataService.getData(["knowledge", "object", "topic", this.userKey]).subscribe((objects: any[]) => {
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
}
