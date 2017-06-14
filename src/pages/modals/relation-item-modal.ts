import { Component } from '@angular/core';

import { NavParams, ViewController } from 'ionic-angular';

import { AssociationModel, EquipmentModel, KnowledgeModel, RelationModel } from '../../models/interfaces';
import { DataService } from '../../providers/apiData.service';

@Component({
  templateUrl: './relation-item-modal.html'
})
export class RelationModalPage {
  item: RelationModel = {id: ""};
  relationType: string;
  relations: Array<KnowledgeModel<EquipmentModel,AssociationModel>>;


  constructor(
    navParams: NavParams,
    private viewCtrl: ViewController,
    private dataService:DataService
  ) {
    //this.item = this.navParams.get('item');
  }

  doSave(){
    this.dataService.addAssociation(this.item.id, this.relationType, this.item);
    this.viewCtrl.dismiss({
      item: this.item,
      reltype: this.relationType
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
