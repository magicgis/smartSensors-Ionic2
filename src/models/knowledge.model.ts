//import { AssociationModel } from "./association.model";
//import { ProfileModel } from "./profile.model";
//import { DataInterface } from "./objectData.model";
import { Inject } from '@angular/core';
import { AssociationModel } from "./association.model";
import { EquipmentModel } from "./equipment.model";
import { ProfileModel } from "./profile.model";
import { DataInterface } from "./data.interface";
import { AttributeModel } from "./attribute.model";
import { FormBuilder, FormGroup } from '@angular/forms';

export class KnowledgeModel {
  _id?: string;
  root: string;
  access: string;
  type: string;
  subtype: string;
  version: string;
  data: any = "";
  relations: AssociationModel;
  sync: number;

  private formGroup: FormGroup;

  constructor(input?: any, fb?:FormBuilder){
    if (input.template) this.fillTemplate(input, fb);
    else {
      if ( ! input ) input = {};
      this.type    = input[ "type" ] || "";
      this.subtype = input[ "subtype" ] || "";
      if (!input[ "_id" ]) this._id     = input[ "_id" ];
      this.root    = input[ "root" ] || "";
      this.access  = input[ "access" ] || "public";
      this.version = input[ "version" ] || "1.0";
      this.sync    = input[ "sync" ] || Date.now ();

      if ( this.type === "profile" ) this.data = new ProfileModel ( input, fb );
      else this.data = new EquipmentModel ( input, fb );

      this.relations = new AssociationModel ( input, fb );
    }

    if (fb) this.formGroup = fb.group({
      type : [this.type],
      subtype : [this.subtype],
      access : [this.access],
      version : [this.version],
      root : [this.root],
      data: this.data.getFormGroup(),
      relations: this.relations.getFormGroup()
    });
  }

  public fillTemplate(input, fb){

    this.root = input.template.root;
    this.type = input.template.type;
    this.subtype = input.template.subtype;
    this.access = "public";
    this.version = "1.0";
    this.sync = Date.now();

    this.data = new EquipmentModel(input, fb);

    this.relations = new AssociationModel ( input, fb );

    //this.data.fillData(template);
    //this.relations.fillRelations(template.relations);

  }

  public getFormGroup(){
    return this.formGroup;
  }
}
