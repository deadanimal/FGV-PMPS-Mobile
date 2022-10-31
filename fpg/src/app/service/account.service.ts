import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginResponseModel } from '../model/login-response';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private _accountDetails:LoginResponseModel;

  constructor(
    private http: HttpClient
  ) { }

  login(
    username:string,
    password:string
  ): Observable<LoginResponseModel> {

    let postData = {
      "no_kakitangan": username,
      "password": password,
    }
    return this.http.post<LoginResponseModel>(
      `${environment.baseUrl}${environment.login}`,
      postData
    );
  }

  saveAsSessionDetails(details:LoginResponseModel){
    this._accountDetails = details;
  }

  getSessionDetails(){
    return this._accountDetails;
  }
}
