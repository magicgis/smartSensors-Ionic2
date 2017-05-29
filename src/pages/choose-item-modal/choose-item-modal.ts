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
  listTemplates: Array<any>;
  listReferences: any;

  errorMessage: string;
  userKey: string;
  itemType: string;
  listType: string;
  itemSubType: string;

  pageTitle: string;
  slideList: Array<any> = [];

  selectedItem: any;
  selectedType: string = "";
  selectedName: string = "";
  firstSlide: number;

  constructor(
    private navParams: NavParams,
    private dataService:DataService,
    private viewCtrl: ViewController
  ) {
    this.firstSlide = 0;
    this.userKey = this.navParams.get('key');
    this.pageTitle = this.navParams.get('title');
    this.listType = this.navParams.get('listType');
    this.itemType = this.navParams.get('itemType');
    this.getReferenceData();
  }

  ionSlideWillChange() {
    // Initialize the flag
    //this.slides.lockSwipes(true);
    if ( this.slideList.length - this.slides.getActiveIndex() >= 2 )
      this.slides.lockSwipeToNext(false);
    else this.slides.lockSwipeToNext(true);
    if ( this.slides.getActiveIndex() <= 2 )
      this.slides.lockSwipeToPrev(true);
    else  this.slides.lockSwipeToPrev(false);
  }

  itemSelected(itemIndex: number, slideIndex: number) {
    //if (lastSlide) this.doSave(this.listTemplates[itemIndex], this.selectedType);
    this.selectedItem = this.slideList[slideIndex][itemIndex];
    if (this.selectedItem.options.length){
      this.pageTitle = "Novo " + this.selectedItem.name;
      this.selectedType = this.selectedItem.name;
      this.slideList.push("");
      this.slideList[slideIndex+1] = this.selectedItem.options;
      this.slides.lockSwipeToNext(false);
      this.slides.slideTo(slideIndex+1, 500, true);
      this.firstSlide++;
      //this.slides.slideNext(500, true);
    }else if (this.selectedItem.properties.length){
      this.slideList[slideIndex+1] = this.selectedItem.info[0];
      for (let attr of this.selectedItem.properties)
        if (!attr.hidden)
          this.slideList.push(attr);

      this.slides.lockSwipeToNext(false);
      //this.slides.slideTo(slideIndex+1, 500, true);
      this.slides.slideTo(slideIndex+1, 500, true);
    }
  }

  goBack(){
    this.slides.lockSwipeToPrev(false);
    this.slides.slidePrev(500, true);
  }
  goNext(){
    this.slides.lockSwipeToNext(false);
    this.slides.slideNext(500, true);
  }

  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    console.log("Current index is", currentIndex);

    if (this.slides.getActiveIndex()<2) return;

    if(this.slides.getActiveIndex()>= 2) {
      this.pageTitle = this.slideList[this.slides.getActiveIndex()].display;
    }
  }

  public rangeChange(valA: number, valB: number)
  {
    return {below: valA, top: valB};
    //this.myForm.controls['formRange'].updateValue(this.val);
  }

  private getReferenceData() {
    this.dataService.getReferenceData(["all"])
      .subscribe(
        data => {
          this.listReferences = data[0];
          if (this.itemType) this.slideList.push(this.listReferences[[this.listType,"Types"].join("")][this.itemType]);
          else this.slideList.push(this.listReferences[[this.listType,"Types"].join("")]);
          this.firstSlide++;
          this.slideList.push("");
        },
        error =>  this.errorMessage = <any>error);
    /*this.dataService.getReferenceData([[this.listType,"Types"].join(""), this.itemType])
                     .subscribe(
                       data => {
                         this.listReferences = data[[this.listType,"Types"].join("")];
                         if (this.itemType) this.slideList.push(this.listReferences[this.itemType]);
                         else this.slideList.push(this.listReferences);
                         this.slideList.push("");
                       },
                       error =>  this.errorMessage = <any>error);*/
  }


  doSave(){
    this.selectedItem.type = this.selectedType;
    this.viewCtrl.dismiss({
      itemTemplate: this.selectedItem
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}

class ChooseItemPage {

}
