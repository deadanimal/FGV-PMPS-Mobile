import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService, UserRole } from 'src/app/service/account.service';
import { LoginResponseModel } from 'src/app/model/login-response';
import { StorageService } from 'src/app/service/storage.service';
import { LoadingController } from '@ionic/angular';
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
    private loadingCtrl: LoadingController,
  ) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    let loginDetails:LoginResponseModel = await this.accountService._getDataFromStorage();
    this.username = loginDetails.nama;
    this.employeeId = loginDetails.no_kakitangan;
    this.role = this.accountService.getUserRole();
    if(this.role == UserRole.penyelia_qc){
      this.roleShort = "Penyelia QC";
    }else if(this.role == UserRole.petugas_balut){
      this.roleShort = "Petugas Balut";
    }else if(this.role == UserRole.penyelia_balut){
      this.roleShort = "Penyelia Balut";
    }else if(this.role == UserRole.petugas_qc){
      this.roleShort = "Petugas QC";
    }else if(this.role == UserRole.petugas_balut_fatherpalm){
      this.roleShort = "Petugas Fatherpalm";
    }
    if( this.role?.indexOf('Petugas')>=0){
      this.userIconPath="../../../assets/worker_icon.png"
    }else{
      this.userIconPath="../../../assets/penyelia_icon.png"
    }
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
    }else if(this.role == UserRole.petugas_qc){
      this.qcTask = true;
    }else if(this.role == UserRole.penyelia_balut){
      this.wrapTask = true;
      this.debungTask = true;
    }else if(this.role == UserRole.penyelia_qc){
      this.qcTask = true;
    }else if(this.role == UserRole.penyelia_tuai){
      this.harvestTask = true;
    }else if(this.role == UserRole.petugas_tuai){
      this.harvestTask = true;
    }else if(this.role == UserRole.petugas_makmal){
      this.pollenSupplyTask = true;
      this.pollenUseTask = true;
    }else if(this.role == UserRole.penyelia_makmal){
      this.pollenSupplyTask = true;
    }else if(this.role == UserRole.petugas_balut_fatherpalm){
      this.wrapTask = true;
      this.harvestTask = true;
      this.pollenSupplyTask = true;
    }else if(this.role == UserRole.penyelia_fatherpalm){
      this.wrapTask = true;
      this.harvestTask = true;
      this.pollenSupplyTask = true;
    }
    else{
      this.wrapTask = true;
      this.debungTask = true;
      this.qcTask = true;
      this.harvestTask = true;
      this.pollenSupplyTask = true;
      this.pollenUseTask = true;
    }
  }

  async showLoading():Promise<HTMLIonLoadingElement> {
    const loading = await this.loadingCtrl.create();
    loading.present();
    return loading;
  }

  task(task:String){
    if(task == "Penyediaan Pollen" && 
        ( this.role == UserRole.petugas_makmal ||
          this.role == UserRole.petugas_balut_fatherpalm 
        )
    ){
      this.pollenPrepTask();
    }else{
      this.router.navigate(['app/tabs/tab1/main-task',{task:task}]);
    }
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
