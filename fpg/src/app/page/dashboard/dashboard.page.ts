import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/service/account.service';
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
  role:String;
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
    this.role = loginDetails.peranan;
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
    this.loadingModal= await this.showLoading();
    this.taskService.getTaskById(this.employeeId).subscribe(
      (res:[TaskResponseModel]) => {
        this.loadingModal.dismiss();
        if(res.length > 0){
          res.forEach(element => {
            console.log(element);
            if(element.jenis == "balut"){
              this.wrapTask = true;
            }else if(element.jenis == "debung"){
              this.debungTask = true;
            }else if(element.jenis == "kawal"){
              this.qcTask = true;
            }else if(element.jenis == "tuai"){
              this.harvestTask = true;
            }
          });
        }else{
        }
      },
      (err:HttpErrorResponse) => {
        this.loadingModal.dismiss();
      }
    );
  }

  async showLoading():Promise<HTMLIonLoadingElement> {
    const loading = await this.loadingCtrl.create();
    loading.present();
    return loading;
  }

  task(task:String){
    this.router.navigate(['app/tabs/tab1/main-task',{task:task}]);
  }

  logout(){
    this.storageService.eraseAll();
    this.router.navigateByUrl('/login',{
      replaceUrl : true
    });
  }

}
