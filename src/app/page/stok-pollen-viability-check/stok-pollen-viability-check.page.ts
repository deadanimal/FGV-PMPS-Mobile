import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonSelect, ModalController } from '@ionic/angular';
import { TaskStatus } from 'src/app/common/task-status';
import { BaggingModel } from 'src/app/model/bagging';
import { HarvestModel } from 'src/app/model/harvest';
import { PollenPreparationModel } from 'src/app/model/pollen-preparation-model';
import { StokPollenModel } from 'src/app/model/stok-pollen';
import { ModalService } from 'src/app/service/modal.service';
import { BaggingService } from 'src/app/service/tasks/bagging.service';
import { HarvestService } from 'src/app/service/tasks/harvest.service';
import { PollenPreparationService } from 'src/app/service/tasks/pollen-preparation.service';
import { PollenUsageService } from 'src/app/service/tasks/pollen-usage.service';

@Component({
  selector: 'app-stok-pollen-viability-check',
  templateUrl: './stok-pollen-viability-check.page.html',
  styleUrls: ['./stok-pollen-viability-check.page.scss'],
})
export class StokPollenViabilityCheckPage implements OnInit {

  stockPollenId:number;
  stockPollen:StokPollenModel;
  testTime:string;
  pollenType:string;
  baggingTime:string;
  harvestTime:string;
  pollenNo:string;
  @ViewChild("id1") id1!: IonSelect;

  constructor(
    private harvestService:HarvestService,
    private pollenPrepService:PollenPreparationService,
    private stockPollenService:PollenUsageService,
    private baggingService:BaggingService,
    private router:Router,
    private modalService:ModalService,
    private activatedRoute:ActivatedRoute,
    private datePipe: DatePipe,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if(params['stokPollenId']!=null){
        this.stockPollenId = params['stokPollenId'];
        this.populateInfo();
      }
    });
  }

  populateInfo(){
    this.testTime = this.datePipe.transform(Date.now(),"yyyy-MM-dd HH:mm a");
    this.stockPollenService.getById(this.stockPollenId,(res:StokPollenModel)=>{
      this.stockPollen = res;
      this.pollenPrepService.getById(res.pollen_id.toString(),(res1:PollenPreparationModel)=>{
        this.pollenNo = res1.pokok?.progeny+"-"+res1.pokok?.id;
        this.pollenType = 'Pendebungaan Terkawal';
        this.baggingService.getByTandanId(res1.tandan_id,(res2:BaggingModel[])=>{
          res2.forEach(el => {
            if(el.status == TaskStatus.verified){
              this.baggingTime = this.datePipe.transform(Date.parse(res.created_at.toString()),"yyyy-MM-dd HH:mm a");
            }
          });
          this.harvestService.getByTandanId(res1.tandan_id,(res3:HarvestModel[])=>{
            res3.forEach(el => {
              if(el.status == TaskStatus.verified){
                this.harvestTime = this.datePipe.transform(Date.parse(res.updated_at.toString()),"yyyy-MM-dd HH:mm a");
              }
            });
          });
        });
      });
    });
  }

  submit(){
    this.pollenPrepService.update(
      this.stockPollen.pollen_id.toString(),
      {
        viabiliti_pollen:this.id1.value??"",
      },
      (res:PollenPreparationModel)=>{
        this.stockPollenService.update(this.stockPollen.id,
          {
            status:TaskStatus.done
          },
          (res1:StokPollenModel)=>{
            if(res1.id != null){
              this.modalService.successPrompt(
                "Borang Viability Check telah berjaya disimpan").then(
                (value)=>{
                  this.router.navigateByUrl(
                    '/app/tabs/tab1',
                    {
                      replaceUrl : true
                    }
                  );
                }
              );
            }else{
              this.modalService.successPrompt("Ralat, Sila cuba lagi").then(
                (value)=>{
                }
              );
            }
          }
        );
      }
    );

  }

  removePollen(){
    this.pollenPrepService.update(
      this.stockPollen.pollen_id.toString(),
      {
        status_pollen:"lupus"
      },
      (res:PollenPreparationModel)=>{
        this.stockPollenService.update(this.stockPollen.id,
          {
            status:TaskStatus.done
          },
          (res1:StokPollenModel)=>{
            if(res1.id != null){
              this.modalService.successPrompt(
                "Pollen ini akan dilupuskan").then(
                (value)=>{
                  this.router.navigateByUrl(
                    '/app/tabs/tab1',
                    {
                      replaceUrl : true
                    }
                  );
                }
              );
            }else{
              this.modalService.successPrompt("Ralat, Sila cuba lagi").then(
                (value)=>{
                }
              );
            }
          }
        );
      }
    );
  }

}
