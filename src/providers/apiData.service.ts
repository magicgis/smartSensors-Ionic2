import {Injectable} from '@angular/core';
import {Platform} from 'ionic-angular';
import {User} from '@ionic/cloud-angular';

import {Http, Headers, RequestOptions, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/observable/of';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';

import {KnowledgeModel} from '../models/knowledge.model';
//import {AssociationModel} from '../models/association.model';
//import {ObjectModel} from '../models/object.model';
//import {RelationModel} from '../models/relation.model';

@Injectable()
export class DataService {
  private dbUrl: string = 'http://127.0.0.1:3001/';
  // Publishes new info to Observers

  constructor(private platform: Platform,
              public user: User,
              private http:Http){}


  startEquipment(body: any): Observable<KnowledgeModel[]> {
    //let transactionObj = new KnowledgeModel(newObject);
    return this.http.post(this.dbUrl + "api/action/start", body, this.generateHeader(true))
          .map(this.extractData)
          .catch(this.handleError);
  };

  getReferenceData(resource: Array<string>): Observable<KnowledgeModel[]> {
    return this.http.get(this.dbUrl + "api/reference/" + resource.join("/"), this.generateHeader(false))
      .map(response => response.json() as any);
      //.map(this.processData)
      //.catch(this.handleError);
  }


  getData(resource: Array<string>): Observable<KnowledgeModel[]> {
    return this.http.get(this.dbUrl + "api/knowledge/" + resource.join("/"), this.generateHeader(false))
      .map(response => response.json() as KnowledgeModel[]);
      //.map(this.processData)
      //.catch(this.handleError);
  }

  getOne(resource: Array<string>): Observable<KnowledgeModel> {
    return this.http.get(this.dbUrl + "api/knowledge/" + resource.join("/"), this.generateHeader(false))
      .map(response => response.json() as KnowledgeModel)
      .catch(this.handleError);
  }

  getStaticData(resource: Array<string>, requestedCols: string): Promise<KnowledgeModel> {
    const url = this.dbUrl + "api/knowledge/" + resource.join("/") + '/?columns=' + requestedCols;
    return this.http.get(url, this.generateHeader(false))
        .toPromise()
        .then(this.extractData)
        .catch(this.handleStaticError);
  }

  createKnowledge(newObject: any): Observable<KnowledgeModel> {
    let transactionObj = new KnowledgeModel(newObject);
    return this.http.put(this.dbUrl + "api/knowledge", transactionObj, this.generateHeader(true))
          .map(this.extractData)
          .catch(this.handleError);
  }

  updateKnowledge(resource: string, newData: {}): Observable<KnowledgeModel> {
    //let transactionObj = new KnowledgeModel(changes);
    let url = this.dbUrl + "api/knowledge/" + resource;
    return this.http.post(url, newData, this.generateHeader(true))
          .map(this.extractData)
          .catch(this.handleError);
  }

  updateAttribute(documentId: string, newValues: any): any {
    let url = this.dbUrl + "api/knowledge/" + documentId;
    return this.http.post(url, newValues, this.generateHeader(true))
          .map(this.extractData)
          .catch(this.handleError);
          //.map(this.extractData)
          //.catch(this.handleError);
  }

  removeKnowledge(resource: string): Observable<KnowledgeModel> {
    return this.http.delete(this.dbUrl + "api/knowledge/" + resource, this.generateHeader(false))
      .map(this.processItem)
      .catch(this.handleError);
  }

  removeAttribute(documentId: string, attribute: string): any {
    let url = this.dbUrl + "api/knowledge/" + documentId + "/" + attribute;
    return this.http.delete(url, this.generateHeader(true))
        .map(this.extractData)
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

  private processData(result: any): KnowledgeModel[]{
    let body = result.json();
    let returnObjects = [];
    for (let item of body){
      returnObjects.push(new KnowledgeModel(item));
    }
    return returnObjects;
  }

  private processItem(result: any): KnowledgeModel{
    return new KnowledgeModel(result.json());
  }

  private extractData(res: Response) {
    let body = res.json();
    return body || { };
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
