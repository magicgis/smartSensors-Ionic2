import { Component, ViewChild} from '@angular/core';

import { NavParams, ViewController, Slides } from 'ionic-angular';
import { DataService } from '../../providers/apiData.service';
import { AttributeModel } from '../../models/attribute.model';

@Component({
  templateUrl: './choose-item-modal.html'
})
export class ChooseItemModal {
  @ViewChild(Slides) slides: Slides;

  item: AttributeModel;
  index: string;
  ref: string;
  selectedItems: Array<any>;
  listEquipments: Array<any>;
  listReferences: any;

  errorMessage: string;
  userKey: string;
  itemType: string;
  listType: string;
  itemSubType: string;
  pageTitle: string;
  selectedItem: any;
  selectedType: string = "";
  firstSlide: number = 0;

  constructor(
    private navParams: NavParams,
    private dataService:DataService,
    private viewCtrl: ViewController
  ) {
    this.userKey = this.navParams.get('key');
    this.pageTitle = this.navParams.get('title');
    this.listType = this.navParams.get('listType');
    this.itemType = this.navParams.get('itemType');
    if (this.itemType) this.firstSlide = 1;
    this.getReferenceData();
  }

  ionViewDidEnter() {
    // Initialize the flag
    this.slides.lockSwipeToPrev(true);
    this.slides.lockSwipeToNext(true);

  }

  ionSlideDidChange(){
    if (this.slides.getActiveIndex() === this.firstSlide) this.slides.lockSwipeToPrev(true);
    else {
      this.slides.lockSwipeToPrev(false);
      this.slides.lockSwipeToNext(true);
    }
  }

  itemSelected(itemIndex: number) {
    if (!this.listEquipments[itemIndex].options.length) this.doSave(this.listEquipments[itemIndex], this.selectedType);
    else{
      this.pageTitle = this.listEquipments[itemIndex].name;
      this.selectedType = this.listEquipments[itemIndex].name;
      this.listEquipments = this.listEquipments[itemIndex].options;
      this.slides.lockSwipeToNext(false); this.slides.slideNext(500, true);
    }
  }

  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    console.log("Current index is", currentIndex);
  }

  private getReferenceData() {
    this.dataService.getReferenceData([[this.listType,"Types"].join(""), this.itemType])
                     .subscribe(
                       data => {
                         this.listReferences = data[[this.listType,"Types"].join("")];
                         if (this.itemType) this.listEquipments = this.listReferences[this.itemType];
                         else this.listEquipments = this.listReferences;
                       },
                       error =>  this.errorMessage = <any>error);
  }


  doSave(selectedItem, selectedType){
    this.viewCtrl.dismiss({
      selectedItem: selectedItem,
      selectedType: selectedType
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}

class ChooseItemPage {

}
