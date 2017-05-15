import { Component } from '@angular/core';

import { NavParams, ViewController } from 'ionic-angular';

@Component({
  templateUrl: './attributeModal.html'
})
export class ModalContentPage {
  name: string;
  attribute: string;

  constructor(
    params: NavParams,
    private viewCtrl: ViewController
  ) {}

  doSave(){
    this.viewCtrl.dismiss({
      name: this.name,
      attribute: this.attribute
    });
  }
  
  dismiss() {
    this.viewCtrl.dismiss();
  }
}
