import { Component } from '@angular/core';

import { NavParams, ViewController } from 'ionic-angular';

import { ConnectorTypes, CONNECTORS } from '../../references/references';

@Component({
  selector: 'popover-page',
  templateUrl: './item-popover.html'
})
export class ItemPopOverPage {
  objectEle: any;

  constructor(private navParams: NavParams,
              private viewCtrl: ViewController) {
    if (this.navParams.data.items) {
      this.objectEle = this.navParams.data.items;
    }
  }

  close() {
    this.viewCtrl.dismiss();
  }

  displayConnector(connector){
    return CONNECTORS[ConnectorTypes[connector]].name;
  }
}
