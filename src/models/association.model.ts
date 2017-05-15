import { BasicObjectModel } from "./basic-object.model"
export class AssociationModel {
  constructor(
    public next: BasicObjectModel,
    public previous : BasicObjectModel
  ){ }
}
