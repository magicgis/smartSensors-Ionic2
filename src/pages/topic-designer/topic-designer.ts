import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { DataService } from '../../providers/apiData.service';
import { User } from '@ionic/cloud-angular';


@Component({
  selector: 'page-topic-designer',
  templateUrl: '../templates/details-page.html'
})
export class TopicDesignerPage {
  pageTitle: string;
  imgdef:string = "assets/icons/img/ionic.png";
  listed: boolean = false;
  shouldShowDelete: boolean = false;
  selectedItem: any;
  values: Array<{}>;
  object: Array<{}>;
  properties: Array<{}>;
  associations: Array<{}>;

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
              private dataService:DataService) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
  }

  /*ngOnInit() {
        this.dataService.findAll(["object", "sink", "all"]).subscribe(
            data => this.objects = data
        );
  }*/

  ionViewDidLoad() {
    this.dataService.getData(["object", this.selectedItem]).subscribe((result: any[]) => {
      this.pageTitle  = result[0].data.name;
      this.properties = Object.keys(result[0].data);
      this.values     = result[0].data;
      this.object     = result[0];
    });
    this.dataService.getData(["association", "connected", "last" , this.selectedItem]).subscribe((objects: any[]) => {
      this.associations = objects;
    });
  }

  toggleList(){this.listed = !this.listed};
  toggleDelete(){this.shouldShowDelete = !this.shouldShowDelete};

  propertyTapped(event, item) {
      /*this.navCtrl.push(HubDetailsPage, {
          item: item
      });*/
  }

  editItem(event: any, itemIndex: number){

  }
  enableItem(event: any, itemIndex: number){

  }
  removeItem(event: any, itemIndex: number){

  }

  itemTapped(event, item) {
      if (this.associations[item]["data"]["next"]["type"] === "sensor") this.doNavigateSensor(this.associations[item]["data"]["next"]["id"]);
      else if (this.associations[item]["data"]["next"]["type"] === "actuator") this.doNavigateActuator(this.associations[item]["data"]["next"]["id"]);
  }

  doNavigateActuator(next: string){
    /*this.navCtrl.push(ActuatorDetailsPage, {
        item: item.next
    });*/
  }
  doNavigateSensor(next: string){
    /*this.navCtrl.push(SensorDetailsPage, {
        item: item.next
    });*/
  }
}
