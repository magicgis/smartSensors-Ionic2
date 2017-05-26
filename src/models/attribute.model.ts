import {Validators, FormBuilder, FormGroup } from '@angular/forms';
export class AttributeModel {
  public attribute: string;
  public type: string;
  public value:  any;

  private formGroup: FormGroup;

  constructor(input?: any, fb?: FormBuilder){
    if (!input) input = {};

    this.attribute = input["attribute"] || "";
    this.type = input["type"] || "";
    this.value = input["value"] || "";


    if (fb) this.formGroup = fb.group({
        attribute: [this.attribute],
        type: [this.type],
        value : [this.value]
    });
  }

  public getFormGroup() {
    return this.formGroup;
  }
}
