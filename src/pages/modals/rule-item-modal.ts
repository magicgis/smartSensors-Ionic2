import { Component } from '@angular/core';

import { NavParams, ViewController } from 'ionic-angular';

import { DataService } from '../../providers/apiData.service';

import { CONNECTORS, CATEGORY_TYPES, SIGN_TYPES, ACTION_TYPES } from '../../references/references'

@Component({
  templateUrl: './rule-item-modal.html'
})
export class RuleModalPage {
  category: string;
  operator: string;
  value: string;
  connector: string;
  hasConnector: boolean = false;
  type: string = "";

  pageTitle = "";

  connectors = CONNECTORS;
  categories = CATEGORY_TYPES;
  signs = SIGN_TYPES;
  actions = ACTION_TYPES;

  constructor(
    navParams: NavParams,
    private viewCtrl: ViewController,
    private dataService:DataService
  ) {
    this.hasConnector = !!(navParams.get('index'));
    this.type = navParams.get('type');
    if (this.type === 'rule')
      this.pageTitle = "Regra";
    else
      this.pageTitle = "Ação";
  }

  doSave(){
    this.viewCtrl.dismiss({
      ruleItem: {
        category: this.category,
        operator: this.operator,
        value: this.value,
        connector: this.connector
      }
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
