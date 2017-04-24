import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http'
import { Task } from './task';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class TaskService {
  
  private _url = "http://localhost:4545/";
  private _headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http) { }

  getTasks() : Promise<Task[]>  {
    return this.http.get(this._url + "tasks")
      .toPromise()
      .then(response => response.json() as Task[])
  }

  getTask(key: string) : Promise<Task>  {
    return this.http.get(this._url + "task/" + key)
      .toPromise()
      .then(response => response.json() as Task)
  }

  createTask(task) : Promise<any>  {
    return this.http.post(this._url + "create", task, this._headers)
      .toPromise()
      .then(response => response.json())
  }

  editTask(key: string, task) : Promise<any>  {
    return this.http.post(this._url + "edit/" + key, task, this._headers)
      .toPromise()
      .then(response => response.json())
  }

  completeTask(key: string) : Promise<any>  {
    return this.http.post(this._url + "complete/" + key, this._headers)
      .toPromise()
      .then(response => response.json())
  }

  deleteTask(key: string) : Promise<any>  {
    return this.http.post(this._url + "delete/" + key, this._headers)
      .toPromise()
      .then(response => response.json())
  }

}
