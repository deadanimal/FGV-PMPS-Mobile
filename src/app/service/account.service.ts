import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginResponseModel } from '../model/login-response';
import { StorageService } from './storage.service';

export enum UserRole {
  penyelia_balut  = "Penyelia Balut & Pendebungaan Terkawal",
  petugas_balut   = "Petugas Balut & Pendebungaan Terkawal",
  penyelia_qa     = "Penyelia Kawalan Kualiti",
  petugas_qa      = "Petugas Kawalan Kualiti",
  general_worker  = "Petugas Am",
  unknown         = "Unknown",
}
@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private _accountDetails:LoginResponseModel;

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
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

  getUserRole():UserRole{
    let role:UserRole = UserRole.unknown;
    if(this._accountDetails!=null){
      if(UserRole.penyelia_balut == this._accountDetails.peranan){
        role = UserRole.penyelia_balut;
      }else if(UserRole.penyelia_qa == this._accountDetails.peranan){
        role = UserRole.penyelia_qa;
      }else if(UserRole.petugas_balut == this._accountDetails.peranan){
        role = UserRole.petugas_balut;
      }else if(UserRole.petugas_qa == this._accountDetails.peranan){
        role = UserRole.petugas_qa;
      }else if(UserRole.unknown == this._accountDetails.peranan){
        role = UserRole.unknown;
      }
    }
    return role;
  }

  async _getDataFromStorage(){
    let loginDetail:LoginResponseModel = await this.storageService.get(this.storageService.loginDetail);
    this.saveAsSessionDetails(loginDetail);
  }
}
