import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { GenericTextModalComponent } from 'src/app/component/generic-text-modal/generic-text-modal.component';
import { TaskResponseModel } from 'src/app/model/task-response';
import { TaskService } from 'src/app/service/task.service';

@Component({
  selector: 'app-create-new-task',
  templateUrl: './create-new-task.page.html',
  styleUrls: ['./create-new-task.page.scss'],
})
export class CreateNewTaskPage implements OnInit {

  taskType:String;
  tandanId:String;
  date:String;
  workerId:String;
  taskBtnName:String;
  taskIconPath:String;
  loadingModal:any;

  constructor(
    private activatedRoute:ActivatedRoute,
    private taskService:TaskService,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private router: Router,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if(params['taskType']!=null){
        switch (params['taskType']) {
          case "Balut":
            this.taskType = "balut";
            this.taskBtnName = "Balut";
            this.taskIconPath = "../../../assets/balut_icon.png";
            break;
          case "Pendebungaan Terkawal (CP)":
            this.taskType = "debung";
            this.taskBtnName = "Pendebungaan Terkawal (CP)";
            this.taskIconPath = "../../../assets/cp_icon.png";
            break;
          case "Kawalan Kualiti (QC)":
            this.taskType = "kawal";
            this.taskBtnName = "Kawalan Kualiti (QC)";
            this.taskIconPath = "../../../assets/qc_icon.png";
            break;
          case "Tuai":
            this.taskType = "tuai";
            this.taskBtnName = "Tuai";
            this.taskIconPath = "../../../assets/tuai_icon.png";
            break;
          default:
            break;
        }
      }
    });
  }

  async submit(form:NgForm){
    this.loadingModal= await this.showLoading();
    this.taskService.createNewTask(
      this.tandanId,
      this.taskType,
      "task created from APP",
      this.date,
      this.workerId).subscribe(
      async (res:TaskResponseModel) => {
        this.loadingModal.dismiss();
        if(res!=null){
          const modal= await this.modalCtrl.create({
            component: GenericTextModalComponent,
            componentProps:{
              value:"Success"
            },
            cssClass:"small-modal",
            backdropDismiss:false,
          });
          modal.present();
          setTimeout(() => {
            modal.dismiss();
            this.router.navigateByUrl(
              '/app/tabs/tab1',
              {
                replaceUrl : true
              }
            );
          },500);
        }else{
          const modal= await this.modalCtrl.create({
            component: GenericTextModalComponent,
            componentProps:{
              value:"Failed"
            },
            cssClass:"small-modal",
            backdropDismiss:false,
          });
          modal.present();
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

}
