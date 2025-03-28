import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginResponseModel } from '../model/login-response';
import { TandanResponse } from '../model/tandan-response';
import { TaskResponseModel } from '../model/task-response';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(
    private http: HttpClient,
  ) { }

  getTaskById(
    userId:String,
  ): Observable<[TaskResponseModel]> {
    return this.http.get<[TaskResponseModel]>(
      `${environment.baseUrl}${environment.taskByUserId}${userId}`
    );
  }

  getAllTask(
  ): Observable<[TaskResponseModel]> {
    return this.http.get<[TaskResponseModel]>(
      `${environment.baseUrl}${environment.allTaskList}`
    );
  }

  getTask(
    taskId:String,
  ): Observable<TaskResponseModel> {
    return this.http.get<TaskResponseModel>(
      `${environment.baseUrl}${environment.taskById}${taskId}`
    );
  }

  getUserById(
    userId:number,
  ): Observable<LoginResponseModel> {
    return this.http.get<LoginResponseModel>(
      `${environment.baseUrl}${environment.profileById}${userId}`
    );
  }

  getTandanById(
    tandanId:String,
  ): Observable<TandanResponse> {
    return this.http.get<TandanResponse>(
      `${environment.baseUrl}${environment.tandanInfo}${tandanId}`
    );
  }

  createTask(
    formData:FormData
  ): Observable<TaskResponseModel> {
    return this.http.post<TaskResponseModel>(
      `${environment.baseUrl}${environment.task}`,
      formData
    );
  }
  
  updateTaskToDone(
    taskId:string,
    formData:FormData
  ): Observable<TaskResponseModel> {
    return this.http.post<TaskResponseModel>(
      `${environment.baseUrl}${environment.task}${taskId}/siap`,
      formData
    );
  }

  acceptTask(
    taskId:String,
    svId:String,
    svRemarks:String
  ): Observable<TaskResponseModel> {
    let postData={
      "pengesah_id":svId,
      "catatan_pengesah":svRemarks,
    };
  
    return this.http.post<TaskResponseModel>(
      `${environment.baseUrl}${environment.task}${taskId}/sah`,
      postData
    );
  }

  rejectTask(
    taskId:String,
    svId:String,
    svRemarks:String
  ): Observable<TaskResponseModel> {
    let postData={
      "pengesah_id":svId,
      "catatan_pengesah":svRemarks,
    };
  
    return this.http.post<TaskResponseModel>(
      `${environment.baseUrl}${environment.task}${taskId}/rosak`,
      postData
    );
  }

  createNewTask(
    tandanId:String,
    type:String,
    remark:String,
    date:String,
    workerId:String,
  ): Observable<TaskResponseModel> {
    let postData={
      "tandan_id":tandanId,
      "jenis":type,
      "catatan":remark,
      "tarikh":date,
      "petugas_id":workerId,
    };
  
    return this.http.post<TaskResponseModel>(
      `${environment.baseUrl}${environment.task}`,
      postData
    );
  }
}
