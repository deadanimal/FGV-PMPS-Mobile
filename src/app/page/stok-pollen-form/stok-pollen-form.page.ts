import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonSelect, NavController } from '@ionic/angular';
import { TaskStatus } from 'src/app/common/task-status';
import { HarvestModel } from 'src/app/model/harvest';
import { PollenPreparationModel } from 'src/app/model/pollen-preparation-model';
import { StokPollenModel } from 'src/app/model/stok-pollen';
import { AccountService } from 'src/app/service/account.service';
import { ModalService } from 'src/app/service/modal.service';
import { HarvestService } from 'src/app/service/tasks/harvest.service';
import { PollenPreparationService } from 'src/app/service/tasks/pollen-preparation.service';
import { PollenUsageService } from 'src/app/service/tasks/pollen-usage.service';

@Component({
  selector: 'app-stok-pollen-form',
  templateUrl: './stok-pollen-form.page.html',
  styleUrls: ['./stok-pollen-form.page.scss'],
})
export class StokPollenFormPage implements OnInit {

  block:string;
  no_pollen:string;
  pollen_weight:string;
  outgoing_amount:string;
  returned_ammount:string;
  current_ammount:string;
  viability:string;
  @ViewChild("id1") id1!: IonSelect;
  stockPollenId:number;
  isReturn:boolean = false;
  pollenList:PollenPreparationModel[];
  availableBlock:string[];

  selectedBlock:string;
  selectedPollen:PollenPreparationModel;

  constructor(
    private pollenUsageService:PollenUsageService,
    private pollenPrepService:PollenPreparationService,
    private accountService:AccountService,
    private activatedRoute:ActivatedRoute,
    private harvestService:HarvestService,
    private modalService:ModalService,
    private navCtrl:NavController,
    private router:Router,
  ) { }

  ngOnInit() {
    this.pollenList = [];
    this.activatedRoute.params.subscribe(params => {
      if(params['pollenId']!=null){
        this.stockPollenId = params['pollenId'];
        this.isReturn = true;
       }
      this.getPollenList();
    });
  }

  async ionViewDidEnter() {
  }

  submit(){
    if(this.isReturn){
      this.update();
    }else{
      this.create();
    }
  }

  async create(){
    let user = await this.accountService._getDataFromStorage();
    let stokPollen:StokPollenModel = {
      amaun_keluar:parseInt(this.outgoing_amount),
      amaun_semasa:parseInt(this.current_ammount),
      dicipta_oleh:user.no_kakitangan,
      status:TaskStatus.created,
      pollen_id:this.selectedPollen.id,
    };
    this.pollenUsageService.create(stokPollen,(res:StokPollenModel)=>{
      if(res.id != null){
        this.modalService.successPrompt("Aktiviti anda telah berjaya disimpan").then(
          (value)=>{
            this.navCtrl.pop();
            this.navCtrl.pop();
          }
        );
      }else{
        this.modalService.successPrompt("Ralat, Sila cuba lagi").then(
        (value)=>{
        }
      );
      }
    });
  }

  async update(){
    let user = await this.accountService._getDataFromStorage();
    let stokPollen:StokPollenModel = {
      amaun_keluar:parseInt(this.returned_ammount),
      amaun_semasa:parseInt(this.current_ammount),
      dikemaskini_oleh:user.no_kakitangan,
      status:TaskStatus.done,
      pollen_id:this.selectedPollen.id,
    };
    this.pollenUsageService.update(this.stockPollenId,stokPollen,(res:StokPollenModel)=>{
      if(res.id != null){
        this.modalService.successPrompt("Aktiviti anda telah berjaya disimpan").then(
          (value)=>{
            this.router.navigate(
              [
                '/app/tabs/tab1/stok-pollen-viability-check',
                {stokPollenId:this.stockPollenId}
              ]
            );
          }
        );
      }else{
        this.modalService.successPrompt("Ralat, Sila cuba lagi").then(
        (value)=>{
        }
      );
      }
    });

  }

  populateData(){
    this.pollenUsageService.getById(this.stockPollenId,(res:StokPollenModel)=>{
      this.outgoing_amount = res.amaun_keluar.toString();
      this.current_ammount = res.amaun_semasa.toString();
      this.pollenList.forEach(el => {
        if(el.id == res.pollen_id){
          this.selectedPollen = el;
          this.block = el.pokok.blok;
          this.no_pollen = el.id.toString();
          this.viability = el.viabiliti_pollen;
          this.getHarvestTask(el.tandan_id);
        }
      });
    });
  }

  getHarvestTask(tandanId){
    this.harvestService.getByTandanId(tandanId,(res:HarvestModel[])=>{
      res.forEach(el => {
        if(el.status == TaskStatus.verified){
          this.pollen_weight = el.berat_tandan +" KG";
        }
      });
    }, false);
  }

  getPollenList(){
    this.pollenPrepService.getAll((res:PollenPreparationModel[])=>{
      this.pollenList = res;
      this.filterAvailableBlock();
      if(this.stockPollenId != null){
        this.populateData();
      }
    });
  }

  filterAvailableBlock(){
    this.availableBlock = [];
    this.pollenList.forEach(el => {
      if(!this.availableBlock.includes(el.pokok.blok)){
        this.availableBlock.push(el.pokok.blok);
      }
    });
  }

  getFilteredPollenList(){
    let retVal:PollenPreparationModel[] = [];
    if(this.selectedBlock!= null){
      this.pollenList.forEach(el => {
        if(el.pokok.blok == this.selectedBlock){
          retVal.push(el);
        }
      });
    }else{
      retVal = this.pollenList;
    }
    
    return retVal;
  }

  
  blockChange(e) {
    this.selectedBlock = e.detail.value;
  }

  pollenChange(e){
    this.pollenList.forEach(el => {
      if(el.id == e.detail.value){
        this.getHarvestTask(el.tandan_id);
        this.selectedPollen = el;
      }
    });
  }

}
