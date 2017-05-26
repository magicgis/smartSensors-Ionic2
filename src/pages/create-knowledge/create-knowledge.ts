import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavController, NavParams, Slides  } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
// Observable operators
import 'rxjs/add/operator/catch';

import { DataService } from '../../providers/apiData.service';
import { User } from '@ionic/cloud-angular';
import { ModalContentPage }  from '../modals/attribute-item';

import { KnowledgeModel } from '../../models/knowledge.model';
import { RelationModel } from '../../models/relation.model';
import { AttributeModel } from '../../models/attribute.model';

@Component({
  selector: 'page-create',
  templateUrl: './create-page.html'
})
export class CreateKnowledgePage implements OnInit{
  knowledgeForm: FormGroup;

  pageTitle: string;
  imgdef:string = "assets/icons/img/ionic.png";

  listInfo: boolean = true;
  listConfigurations: Array<boolean> = [];
  associationList: Array<string> = [];
  errorMessage: string;
  userKey: string;

  selectedSegment: string = "main";
  selectedItem: string = "";
  templateData: any;
  templateType: string;
  knowledge: KnowledgeModel;
  referenceData: any = [];
  values: Array<any> = [];

  constantsWindows: Object = {
    newItemWindow: {
      title: "Nova Associação",
      mensagem: "Qual o nome da associação?"
    },
    create: "Criar Associação",
    update: "Salvar"
  };

  submitted = false;

  constructor(public user:User,
              public navCtrl: NavController,
              public navParams: NavParams,
              public modalCtrl: ModalController,
              private fb: FormBuilder,
              private dataService:DataService) {
    // If we navigated to this page, we will have an item available as a nav param
    this.templateData = this.navParams.get('template');
    this.templateType = this.navParams.get('type');
    if (this.templateData) this.pageTitle = this.templateData.name;
    this.selectedItem = this.navParams.get('item');
    this.userKey = this.navParams.get('key');

  }

  ngOnInit() {
    this.getReferenceData();
    if(this.selectedItem) this.setKnowledgeForm();
    else {
      this.knowledge = new KnowledgeModel({
        root: this.userKey,
        type: this.templateType,
        subtype: this.templateData.type
      },this.fb);
      this.knowledgeForm = this.knowledge.getFormGroup();
      for (let rel of this.templateData.relations) {

      }
    }
  }

  private getReferenceData() {
    this.dataService.getReferenceData(["all"])
                     .subscribe(
                       data => this.referenceData = data,
                       error =>  this.errorMessage = <any>error);
  }

  private setKnowledgeForm() {
      this.dataService.getOne([this.selectedItem])
                       .subscribe(result => {
                         this.knowledge = new KnowledgeModel(result, this.fb);
                         this.knowledgeForm = this.knowledge.getFormGroup();
                          /*for (let item of Object.keys(result.relations)) {
                            if (result.relations[item]!=='object') continue;
                            const control = <FormArray>this.knowledgeForm["relations"].controls[item];
                            for (let arrayItem of result.relations[item])
                                control.push(new RelationModel(this.fb).createFilledFormGroup(arrayItem, this.fb));
                          }

                          const infoControl = <FormArray>this.knowledgeForm["data"].controls['info'];
                          for (let resInfo of result.data.info)
                              infoControl.push(new AttributeModel(this.fb).createFilledFormGroup(resInfo, this.fb));

                          const configControl = <FormArray>this.knowledgeForm["data"].controls['configurations'];
                          for (let resConfig of result.data.configurations)
                              configControl.push(new AttributeModel(this.fb).createFilledFormGroup(resConfig, this.fb));*/
                       },error =>  this.errorMessage = <any>error);
  }

  propertyTapped(event, item) {
      /*this.navCtrl.push(HubDetailsPage, {
          item: item
      });*/
  }

  removeItem(type: string, arrayIndex: number){
    const dataControl = <FormArray>this.knowledgeForm.controls['data'];
    const control = <FormArray>dataControl.controls[type];
    //this.listConfigurations.removeAt(arrayIndex);
    control.removeAt(arrayIndex);
  }

  addItem(type: string){
    var newAttribute = new AttributeModel(null,this.fb);
    const dataControl = <FormArray>this.knowledgeForm.controls['data'];
    const control = <FormArray>dataControl.controls[type];
    control.push(newAttribute.getFormGroup());
    this.listConfigurations.push(true);
  }

  removeAssociation(type: string, arrayIndex: number){
    const relControl = <FormArray>this.knowledgeForm.controls['relations'];
    const control = <FormArray>relControl.controls[type];
    control.removeAt(arrayIndex);
  }

  addAssociation(type: string){
    var newRelation = new RelationModel(null,this.fb);
    const relControl = <FormArray>this.knowledgeForm.controls['relations'];
    const control = <FormArray>relControl.controls[type];
    control.push(newRelation.getFormGroup());
  }

  openModal(type, ref) {
    let modal = this.modalCtrl.create(ModalContentPage);
    modal.present();
    modal.onWillDismiss((data: any) => {
      if (data) {
        console.log('MODAL DATA', data);
        if (type==='add') this.knowledge[ref].push(data.item);
        //else this.values[ref + data.item.attribute] = data.item;
      }
    });
  }

  onSubmit() {
      this.submitted = true;
      console.log(this.knowledgeForm.value, this.knowledgeForm.valid);
  }

  // TODO: Remove this when we're done
  get diagnostic() { return this.knowledgeForm; }

  //////// NOT SHOWN IN DOCS ////////

  // Reveal in html:
  //   Name via form.controls = {{showFormControls(heroForm)}}
  showFormControls(form: any) {
    return form && form.controls['name'] &&
    form.controls['name'].value;
  }

  /////////////////////////////

}
