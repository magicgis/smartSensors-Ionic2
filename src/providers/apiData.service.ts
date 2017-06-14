import {Injectable} from '@angular/core';
import {Platform} from 'ionic-angular';
import {User} from '@ionic/cloud-angular';

import {Http, Headers, RequestOptions, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/observable/of';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';

import {
  AssociationModel, AttributeModel, EquipmentModel, KnowledgeModel, MessageModel,
  RelationModel
} from '../models/interfaces';

@Injectable()
export class DataService {
  //private dbUrl: string = 'http://200.18.98.244:3001/';
  //private dbUrl: string = 'http://192.168.0.7:3001/';
  //private mqttUrl: string = 'mqtt://192.168.0.6:1883/';
  private dbUrl: string = 'http://localhost:3001/';

  // Publishes new info to Observers

  constructor(private platform: Platform,
              public user: User,
              private http:Http){}


  toggleEquipmentStatus(body: any, status: boolean): Observable<any> {
    //let transactionObj = new KnowledgeModel(newObject);
    let url = this.dbUrl + "api/action/boards/" + (status)?"connect":"disconnect";
    return this.http.post(url, body, this.generateHeader(true))
          .map(response => response.json())
          .catch(this.handleError);
  };

  evaluateTopic(body: any): Observable<any> {
    //let transactionObj = new KnowledgeModel(newObject);
    let url = this.dbUrl + "api/action/topic/dynamic";
    return this.http.post(url, body, this.generateHeader(true))
      .map(response => response.json())
      .catch(this.handleError);
  };

  getReferenceData(resource: Array<string>): Observable<KnowledgeModel<EquipmentModel, AssociationModel>[]> {
    return this.http.get(this.dbUrl + "api/reference/" + resource.join("/"), this.generateHeader(false))
      .map(response => response.json() as any);
      //.map(this.processData)
      //.catch(this.handleError);
  }

  getMessengerData(resource: Array<string>, query: any): Observable<KnowledgeModel<MessageModel, AssociationModel>[]> {
    let url = this.dbUrl + "api/messenger/" + resource.join("/");
    if (query!= null) {
      url += '?' + query.join("&");
    }
    return this.http.get(url, this.generateHeader(false))
      .map(response => response.json() as KnowledgeModel<MessageModel, AssociationModel>[]);
    //.map(this.processData)
    //.catch(this.handleError);
  }

  publishMessage(newObject: any): Observable<KnowledgeModel<MessageModel, AssociationModel>> {
    return this.http.put(this.dbUrl + "api/messenger/", newObject, this.generateHeader(true))
      .map(response => response.json())
      .catch(this.handleError);
  }

  getData<T>(resource: Array<string>, query: Array<any>): Observable<KnowledgeModel<T, AssociationModel>[]> {
    let url = this.dbUrl + "api/knowledge/" + resource.join("/");
    if (query!= null) {
      url += '?' + query.join("=");
    }
    return this.http.get(url, this.generateHeader(false))
      .map(response => response.json() as KnowledgeModel<T, AssociationModel>[]);
      //.map(this.processData)
      //.catch(this.handleError);
  }

  getOne<T>(resource: Array<string>): Observable<KnowledgeModel<T, AssociationModel>> {
    return this.http.get(this.dbUrl + "api/knowledge/" + resource.join("/"), this.generateHeader(false))
      .map(response => response.json() as KnowledgeModel<T, AssociationModel>)
      .catch(this.handleError);
  }

  getStaticData(resource: Array<string>, requestedCols: string): Promise<any> {
    const url = this.dbUrl + "api/knowledge/" + resource.join("/") + '?columns=' + requestedCols;
    return this.http.get(url, this.generateHeader(false))
        .toPromise()
        .then(response => response.json())
        .catch(this.handleStaticError);
  }

  createKnowledge<T>(newObject: any): Observable<KnowledgeModel<T, AssociationModel>> {
    //let transactionObj = new KnowledgeModel(newObject);
    //console.log(transactionObj);
    return this.http.put(this.dbUrl + "api/knowledge", newObject, this.generateHeader(true))
          .map(response => response.json() as KnowledgeModel<T, AssociationModel>)
          .catch(this.handleError);


  }

  updateKnowledge<T>(resource: string, newData: {}): Observable<KnowledgeModel<T, AssociationModel>> {
    //let transactionObj = new KnowledgeModel(changes);
    let url = this.dbUrl + "api/knowledge/" + resource;
    return this.http.post(url, newData, this.generateHeader(true))
          .map(response => response.json() as KnowledgeModel<T, AssociationModel>)
          .catch(this.handleError);
  }

  updateAttribute(documentId: string, newValues: any): any {
    let url = this.dbUrl + "api/knowledge/" + documentId;
    return this.http.post(url, newValues, this.generateHeader(true))
          .map(response => response.json())
          .catch(this.handleError);
          //.map(this.extractData)
          //.catch(this.handleError);
  }

  removeKnowledge<T>(resource: string): Observable<KnowledgeModel<T, AssociationModel>> {
    return this.http.delete(this.dbUrl + "api/knowledge/" + resource, this.generateHeader(false))
      .map(response => response.json() as KnowledgeModel<T, AssociationModel>)
      .catch(this.handleError);
  }

  removeAttribute(documentId: string, attribute: string): any {
    let url = this.dbUrl + "api/knowledge/" + documentId + "/" + attribute;
    return this.http.delete(url, this.generateHeader(true))
        .map(response => response.json())
        .catch(this.handleError);
  }

  addAttrInfo(documentId: string, attrName: string, body: AttributeModel): any {
    let url = this.dbUrl + "api/knowledge/" + documentId + "/attr/" + attrName;
    return this.http.post(url, body, this.generateHeader(true))
      .map(response => response.json())
      .catch(this.handleError);
  }

  removeAttrInfo(documentId: string, attrName: string): any {
    let url = this.dbUrl + "api/knowledge/" + documentId + "/attr/" + attrName;
    return this.http.delete(url, this.generateHeader(true))
      .map(response => response.json())
      .catch(this.handleError);
  }

  addAssociation(documentId: string, associationType: string, body: RelationModel): any {
    let url = this.dbUrl + "api/knowledge/" + documentId + "/relation/" + associationType;
    return this.http.post(url, body, this.generateHeader(true))
      .map(response => response.json())
      .catch(this.handleError);
  }

  removeAssociation(documentId: string, associationType: string, relid: string): any {
    let url = this.dbUrl + "api/knowledge/" + documentId + "/" + associationType + "/" + relid;
    return this.http.delete(url, this.generateHeader(true))
      .map(response => response.json())
      .catch(this.handleError);
  }

  private generateHeader(hasbody: boolean): any{
      let headers = new Headers();
      headers.append("Authorization", "Basic " + btoa(this.user.id + ":" + this.user.details.password));
      if (hasbody){
        headers.append( "Accept", "application/json")
        headers.append("Content-Type", "application/json");
      };
      return new RequestOptions({ headers: headers });
    }

  private handleStaticError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  private handleError (error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

}
