import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { RelationModel } from "./relation.model"
export class AssociationModel {
  public abstraction: boolean;
  public parent: string;
  public ownedBy: Array<RelationModel> = [];
  public connectedTo: Array<RelationModel> = [];
  public subscriberAt: Array<RelationModel> = [];
  public likedTo: Array<RelationModel> = [];
  public commentedAt: Array<RelationModel> = [];
  public subscribedBy: Array<RelationModel> = [];

  private formGroup: FormGroup;
  private formOwnedByArray: FormArray;
  private formConnectArray: FormArray;
  private formSubscriberAtArray: FormArray;
  private formLikedToArray: FormArray;
  private formCommentedAtArray: FormArray;
  private formSubscribedByArray: FormArray;

  constructor(input?: any, fb?: FormBuilder){
    if (!input) input = {};

    this.abstraction = input["abstraction"] || false;
    this.parent = input["parent"] || "";

    if (fb) {
      this.formOwnedByArray  = fb.array([]);
      this.formConnectArray  = fb.array([]);
      this.formSubscriberAtArray  = fb.array([]);
      this.formLikedToArray  = fb.array([]);
      this.formCommentedAtArray  = fb.array([]);
      this.formSubscribedByArray  = fb.array([]);
    }

    if (input["ownedBy"]) {
      for(let item of input["ownedBy"]) {
        let relation = new RelationModel(item, fb);
        this.ownedBy.push(relation);
        if (fb) this.formOwnedByArray.push(relation.getFormGroup());
      }

    }
    if (input["connectedTo"]) {
      for(let item of input["connectedTo"]) {
        let relation = new RelationModel(item, fb);
        this.connectedTo.push(relation);
        if (fb) this.formConnectArray.push(relation.getFormGroup());
      }
    }
    if (input["subscriberAt"]) {
      for(let item of input["subscriberAt"]) {
        let relation = new RelationModel(item, fb);
        this.subscriberAt.push(relation);
        if (fb) this.formSubscriberAtArray.push(relation.getFormGroup());
      }
    }
    if (input["likedTo"]) {
      for(let item of input["likedTo"]) {
        let relation = new RelationModel(item, fb);
        this.likedTo.push(relation);
        if (fb) this.formLikedToArray.push(relation.getFormGroup());
      }
    }
    if (input["commentedAt"]) {
      for(let item of input["commentedAt"]) {
        let relation = new RelationModel(item, fb);
        this.commentedAt.push(relation);
        if (fb) this.formCommentedAtArray.push(relation.getFormGroup());
      }
    }
    if (input["subscribedBy"]) {
      for(let item of input["subscribedBy"]) {
        let relation = new RelationModel(item, fb);
        this.subscribedBy.push(relation);
        if (fb) this.formSubscribedByArray.push(relation.getFormGroup());
      }
    }

    if (fb) this.formGroup = fb.group({
        abstraction: [this.abstraction],
        parent: [this.parent],
        ownedBy : this.formOwnedByArray,
        connectedTo: this.formConnectArray,
        subscriberAt: this.formSubscriberAtArray,
        likedTo: this.formLikedToArray,
        commentedAt: this.formCommentedAtArray,
        subscribedBy: this.formSubscribedByArray
      })
  }

  public getFormGroup() {
    return this.formGroup;
  }
}
