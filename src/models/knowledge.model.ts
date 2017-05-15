import { RelationModel } from "./relation.model";
//import { ObjectModel } from "./object.model";
import { AssociationModel } from "./association.model";

export class KnowledgeModel {
  id: number;
  key: string;
  relations: RelationModel;
  data: any;
  type: string;
  subtype: string;
  version: string;
  time: Date;

  constructor(input: any){
    if (input["type"] === 'association'){
      this.data = new AssociationModel(input["data"]["next"], input["data"]["previous"]);
    }else{
      this.data = input["data"];
    }

    this.id = input["_id"] || "";
    this.key = input["key"] || "";
    this.relations = new RelationModel(input["relations"]);
    this.type = input["type"] || "";
    this.subtype = input["subtype"] || "";
    this.version = input["version"] || "";
    this.time = input["time"] || Date.now();
  }
}
