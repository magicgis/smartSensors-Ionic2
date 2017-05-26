import {Validators, FormBuilder, FormGroup } from '@angular/forms';
export class AddressModel {
  public address: string;
  public lat: number;
  public lng: number;

  private formGroup: FormGroup;

  constructor(input?: any, fb?: FormBuilder){
    if (!input) input = {};
    this.address = input["address"] || "Rua M";
    this.lat = input["lat"] || 0.0;
    this.lng = input["lng"] || 0.0;

    if (fb) this.formGroup = fb.group({
        address: [this.address],
        lat: [this.lat],
        lng: [this.lng],
    });
  }

  public getFormGroup() {
    return this.formGroup;
  }
}
