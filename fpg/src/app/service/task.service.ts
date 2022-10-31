import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TaskResponseModel } from '../model/task-response';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(
    private http: HttpClient
  ) { }

  getTaskById(
    userId:String,
  ): Observable<[TaskResponseModel]> {
    return this.http.get<[TaskResponseModel]>(
      `${environment.baseUrl}${environment.taskByUserId}${userId}`
    );
  }
}
