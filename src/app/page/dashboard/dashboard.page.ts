import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService, UserRole } from 'src/app/service/account.service';
import { LoginResponseModel } from 'src/app/model/login-response';
import { StorageService } from 'src/app/service/storage.service';
import { TaskService } from 'src/app/service/task.service';
import { TaskResponseModel } from 'src/app/model/task-response';
import { LoadingController } from '@ionic/angular';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  username:String;
  employeeId:String;
  role:UserRole;
  roleShort:String;
  userIconPath:String;
  loadingModal:any;
  wrapTask:boolean;
  debungTask:boolean;
  qcTask:boolean;
  harvestTask:boolean;
  pollenSupplyTask:boolean;
  pollenUseTask:boolean;

  constructor(
    private router:Router,
    private accountService:AccountService,
    private storageService:StorageService,
    private taskService:TaskService,
    private loadingCtrl: LoadingController,
  ) { }

  ngOnInit() {
    let loginDetails:LoginResponseModel = this.accountService.getSessionDetails();
    this.username = loginDetails.nama;
    this.employeeId = loginDetails.no_kakitangan;
    this.role = this.accountService.getUserRole();
    if(this.role == UserRole.penyelia_qa){
      this.roleShort = "Penyelia QC";
    }else if(this.role == UserRole.petugas_balut){
      this.roleShort = "Petugas Balut";
    }
    if( this.role == UserRole.general_worker || 
        this.role == UserRole.petugas_balut || 
        this.role == UserRole.petugas_qa
      ){
      this.userIconPath="../../../assets/worker_icon.png"
      document.getElementById('iconBg').style.backgroundColor = "#F89521";
    }else{
      this.userIconPath="../../../assets/penyelia_icon.png"
      document.getElementById('iconBg').style.backgroundColor = "rgba(64, 19, 28, 1)";
    }
  }

  ionViewWillEnter() {
    this.wrapTask = false;
    this.debungTask = false;
    this.qcTask = false;
    this.harvestTask = false;
    this.pollenSupplyTask = false;
    this.pollenUseTask = false;
    this._getTasks();
  }

  async _getTasks(){
    if( this.role == UserRole.petugas_balut){
      this.wrapTask = true;
      this.debungTask = true;
    }else if(this.role == UserRole.petugas_qa
      ){
      this.qcTask = true;
    }else if(this.role == UserRole.general_worker){
      this.pollenSupplyTask = true;
      this.pollenUseTask = true;
    }else if(this.role == UserRole.penyelia_balut){
      this.wrapTask = true;
      this.debungTask = true;
    }else if(this.role == UserRole.penyelia_qa){
      this.qcTask = true;
    }
    else{
      this.wrapTask = true;
      this.debungTask = true;
      this.qcTask = true;
      this.harvestTask = true;
      this.pollenSupplyTask = false;
      this.pollenUseTask = false;
    }
  }

  async showLoading():Promise<HTMLIonLoadingElement> {
    const loading = await this.loadingCtrl.create();
    loading.present();
    return loading;
  }

  task(task:String){
    this.router.navigate(['app/tabs/tab1/main-task',{task:task}]);
  }

  pollenPrepTask(){
    this.router.navigate(['app/tabs/tab1/pollen-preps',{task:"Penyediaan Pollen"}]);  
  }

  logout(){
    this.storageService.eraseAll();
    this.router.navigateByUrl('/login',{
      replaceUrl : true
    });
  }

}
