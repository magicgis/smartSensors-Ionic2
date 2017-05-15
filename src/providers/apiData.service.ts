import {Injectable} from '@angular/core';
import {Platform} from 'ionic-angular';

import {Http, Headers, RequestOptions, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import {KnowledgeModel} from '../models/knowledge.model';
//import {AssociationModel} from '../models/association.model';
//import {ObjectModel} from '../models/object.model';
//import {RelationModel} from '../models/relation.model';

@Injectable()
export class DataService {
  private dbUrl: string = 'http://127.0.0.1:3001/';

  constructor(private platform: Platform,
              private http:Http){}


  getData(resource: Array<string>): Observable<KnowledgeModel[]> {
    return this.http.get(this.dbUrl + resource.join("/"))
      .map(response => response.json() as KnowledgeModel[]);
      //.map(this.processData)
      //.catch(this.handleError);
  }

  getOne(resource: Array<string>): Observable<KnowledgeModel> {
    return this.http.get(this.dbUrl + resource.join("/"))
      .map(this.processItem)
      .catch(this.handleError);
  }

  createObject(newObject: any): Observable<KnowledgeModel> {
    let transactionObj = new KnowledgeModel(newObject);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.dbUrl + "knowledge", transactionObj, options)
          .map(this.extractData)
          .catch(this.handleError);
  }

  updateObject(resource: Array<string>, newObject: any): Observable<KnowledgeModel> {
    let transactionObj = new KnowledgeModel(newObject);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.put(this.dbUrl + resource.join("/"), transactionObj, options)
          .map(this.extractData)
          .catch(this.handleError);
  }

  removeData(resource: string): Observable<KnowledgeModel> {
    return this.http.delete(this.dbUrl + "knowledge/" + resource)
      .map(this.processItem)
      .catch(this.handleError);
  }

  processData(result: any): KnowledgeModel[]{
    let body = result.json();
    let returnObjects = [];
    for (let item of body){
      returnObjects.push(new KnowledgeModel(item));
    }
    return returnObjects;
  }

  updateAttribute(documentId: string, newValues: any): any {
    let headers = new Headers({ "Accept": 'application/json', 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let url = this.dbUrl + "knowledge/" + documentId;
    return this.http.post(url, newValues, options)
          .map(this.extractData)
          .catch(this.handleError);
          //.map(this.extractData)
          //.catch(this.handleError);
  }

  removeAttribute(documentId: string, attribute: string): any {
    let headers= new Headers();
    let options= new RequestOptions({headers:headers});
    let url = this.dbUrl + "knowledge/" + documentId + "/" + attribute;
    return this.http.delete(url, "")
        .map(this.extractData)
        .catch(this.handleError);
  }

  processItem(result: any): KnowledgeModel{
    return new KnowledgeModel(result.json());
  }


  getStaticData(resource: Array<string>, requestedCols: string): Promise<KnowledgeModel> {
    const url = this.dbUrl + resource.join("/") + '/?columns=' + requestedCols;
    return this.http.get(url)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleStaticError);
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
