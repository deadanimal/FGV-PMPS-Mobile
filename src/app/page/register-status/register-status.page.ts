import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { UserSelection } from 'src/app/component/scanner-prompt/scanner-prompt.component';
import { ControlPollinationTask } from 'src/app/model/control-pollination-task';
import { TandanResponse } from 'src/app/model/tandan-response';
import { TaskResponseModel } from 'src/app/model/task-response';
import { AccountService } from 'src/app/service/account.service';
import { ModalService } from 'src/app/service/modal.service';
import { TaskService } from 'src/app/service/task.service';
import { ControlPollinationService } from 'src/app/service/tasks/control-pollination.service';
import { TandanService } from 'src/app/service/tasks/tandan.service';

@Component({
  selector: 'app-register-status',
  templateUrl: './register-status.page.html',
  styleUrls: ['./register-status.page.scss'],
})
export class RegisterStatusPage implements OnInit {

  regNumber:String;
  cycle:String;
  status:String;
  age:String;
  taskId:String;
  treeNumber:String;
  scanInput:String;
  taskType:String;
  loadingModal:any;

  constructor(
    private activatedRoute:ActivatedRoute,
    private taskService:TaskService,
    private modalService:ModalService,
    private loadingCtrl: LoadingController,
    private router: Router,
    private tandanService: TandanService,
    private controlPollinationService: ControlPollinationService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit() {
    this.regNumber = "-";
    this.cycle = "-";
    this.status="-";
    this.age="-";

    this.activatedRoute.params.subscribe(params => {
      if(params['taskId']!=null){
        this.taskId = params['taskId'];
      }
      if(params['treeNum']!=null){
        this.treeNumber = params['treeNum'];
      } 
      if(params['scanInput']!=null){
        this.scanInput = params['scanInput'];
      }
      if(params['taskType']!=null){
        this.taskType = params['taskType'];
      }

      if(this.scanInput != null){
        this.regNumber = this.scanInput;
        this._proceedToWork();
      }
    });
  }

  ionViewDidEnter() {
    if(this.taskId != null){
      this._getTask();
    }
  }

  _getCPTask(){
    this.controlPollinationService.getById(this.taskId,(res:ControlPollinationTask)=>{
      this.tandanService.getById(res.tandan_id.toString(),(tandanRes:TandanResponse)=>{
        this.regNumber = tandanRes.no_daftar;
        this.cycle = tandanRes.kitaran;
        this.status=tandanRes.status_tandan;
        this.age=tandanRes.umur? tandanRes.umur.toString(): this._calculateAge(tandanRes.tarikh_daftar).toString();
      });
    });

  }

  _calculateAge(prvDate:string){
    let currentDate = Date.parse(this.datePipe.transform(Date.now(),"yyyy-MM-dd"));
    let rawStringArray = prvDate.split("/");
    let prevDate = Date.parse(rawStringArray[2]+"-"+rawStringArray[1]+"-"+rawStringArray[0]);
    let retVal = (currentDate - prevDate)/1000/60/60/24;
    return retVal;
  }

  async _getTask(){
    if(this.taskType == "Pendebungaan Terkawal (CP)"){
      this._getCPTask();
    }else{
      this.loadingModal= await this.showLoading();
      this.taskService.getTask(this.taskId).subscribe(
        (res:TaskResponseModel) => {
          this.loadingModal.dismiss();
          this._getTandanInfo(res.tandan_id.toString());
        },
        (err:HttpErrorResponse) => {
          this.loadingModal.dismiss();
        }
      );
    }
  }

  async _getTandanInfo(tandan_id:String){
    this.loadingModal= await this.showLoading();
    this.taskService.getTandanById(tandan_id).subscribe(
      (res:TandanResponse) => {
        this.loadingModal.dismiss();
        this.regNumber = res.no_daftar;
        this.cycle = res.kitaran;
        this.status=res.status_tandan;
        this.age=res.umur+" Hari";
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

  promptScan(){
    this.modalService.qrPrompt("No Daftar").then(
      (value)=>{
        let sel:UserSelection;
        sel = value['data'];
        if(sel == UserSelection.manual){
          this._manualInput();
        }else{
          this.router.navigate(
            [
              '/app/tabs/tab2',
              {
                taskId:this.taskId,
                returnUrl:"/app/tabs/tab1/reg-status",
                treeNum:this.treeNumber,
              }
            ],
            {
              replaceUrl : true
            }
          );
        }
    });
  }

  _manualInput(){
    this.modalService.singleInput("No Daftar").then(
      (value)=>{
        let form:NgForm;
        form = value['data'];
        // todo: check for regNumber before proceed to next step
        this.regNumber = form.value.value;
        this._proceedToWork();
      }
    );
  }

  _proceedToWork(){
    this.router.navigate(
      [
        'app/tabs/tab1/task-status',
        {
          regNumber:this.regNumber,
          treeNumber:this.treeNumber,
          taskType:"debung",
        }
      ]
    );
  }

}
