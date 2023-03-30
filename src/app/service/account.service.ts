import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginResponseModel } from '../model/login-response';
import { StorageService } from './storage.service';

export enum UserRole {
  penyelia_balut  = "Penyelia Balut & Pendebungaan Terkawal",
  petugas_balut   = "Petugas Balut & Pendebungaan Terkawal",
  penyelia_qc     = "Penyelia Kawalan Kualiti",
  petugas_qc      = "Petugas Kawalan Kualiti",
  general_worker  = "Petugas Am",
  penyelia_tuai   = "Penyelia Tuai",
  petugas_tuai    = "Petugas Tuai",
  penyelia_makmal = "Penyelia Makmal",
  petugas_makmal  = "Petugas Makmal",
  petugas_balut_fatherpalm  = "Petugas Balut & Tuai Fatherpalm",
  penyelia_fatherpalm  = "Penyelia Fatherpalm",
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
      }else if(UserRole.penyelia_qc == this._accountDetails.peranan){
        role = UserRole.penyelia_qc;
      }else if(UserRole.petugas_balut == this._accountDetails.peranan){
        role = UserRole.petugas_balut;
      }else if(UserRole.petugas_qc == this._accountDetails.peranan){
        role = UserRole.petugas_qc;
      }else if(UserRole.penyelia_tuai == this._accountDetails.peranan){
        role = UserRole.penyelia_tuai;
      }else if(UserRole.petugas_tuai == this._accountDetails.peranan){
        role = UserRole.petugas_tuai;
      }else if(UserRole.penyelia_makmal == this._accountDetails.peranan){
        role = UserRole.penyelia_makmal;
      }else if(UserRole.petugas_makmal == this._accountDetails.peranan){
        role = UserRole.petugas_makmal;
      }else if(UserRole.general_worker == this._accountDetails.peranan){
        role = UserRole.general_worker;
      }else if(UserRole.petugas_balut_fatherpalm == this._accountDetails.peranan){
        role = UserRole.petugas_balut_fatherpalm;
      }else if(UserRole.penyelia_fatherpalm == this._accountDetails.peranan){
        role = UserRole.penyelia_fatherpalm;
      }else if(UserRole.unknown == this._accountDetails.peranan){
        role = UserRole.unknown;
      }
    }
    return role;
  }

  async _getDataFromStorage(){
    let loginDetail:LoginResponseModel = await this.storageService.get(this.storageService.loginDetail);
    this.saveAsSessionDetails(loginDetail);

    return loginDetail;
  }
}
