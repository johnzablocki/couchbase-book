import { Injectable } from '@angular/core';
import { Http } from '@angular/http'
import { Task } from './task';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class TaskService {
  
  private _url = "http://localhost:5000/tasks";

  constructor(private http: Http) { }

  getTasks() : Promise<Task[]>  {
    return this.http.get(this._url)
      .toPromise()
      .then(response => response.json() as Task[])
  }

}
