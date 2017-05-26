
export interface AddressModel {
  address: string;
  lat: number;
  lng: number;
  sync: number;
}

export interface AttributeModel {
  attribute: string;
  type: string;
  value:  any;
}

export interface RelationModel {
  id: string;
  sync: number;
  access: string;
  publish: boolean;
  view: boolean;
}

export interface AssociationModel {
  abstraction: boolean;
  parent: string;
  ownedBy: Array<RelationModel>;
  connectedTo: Array<RelationModel>;
  subscriberAt: Array<RelationModel>;
  likedTo: Array<RelationModel>;
  commentedAt: Array<RelationModel>;
  subscribedBy: Array<RelationModel>;
}

export interface EquipmentModel {
  conected: boolean;
  enabled: boolean;
  updatedValue: string;
  sync: number;
  unit: string;
  icon: string;
  image: string;
  label: string;
  name: string;
  info: Array<AttributeModel>;
  configurations: Array<AttributeModel>;
  geo: AddressModel;
}

export interface ProfileModel {
  displayName: string;
  email: string;
  emailVerified: boolean;
  isAnonymous: boolean;
  photoURL: string;
  providerData: Array<any>;
  token: any;
  uid: string;
  updatedValue: string;
  name: string;
  configurations: Array<any>;
}

export interface KnowledgeModel {
  _id: string;
  root: string;
  access: string;
  relations: AssociationModel;
  data: EquipmentModel;
  type: string;
  subtype: string;
  version: string;
  sync: number;
}
