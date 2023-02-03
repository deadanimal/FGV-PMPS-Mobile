import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonSelect } from '@ionic/angular';
import { PollenPreparationModel } from 'src/app/model/pollen-preparation-model';
import { StokPollenModel } from 'src/app/model/stok-pollen';
import { AccountService } from 'src/app/service/account.service';
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
  @ViewChild("id1") id1!: IonSelect;
  pollenId:number;
  isReturn:boolean = false;
  constructor(
    private pollenUsageService:PollenUsageService,
    private pollenPrepService:PollenPreparationService,
    private accountService:AccountService,
    private activatedRoute:ActivatedRoute,
  ) { }

  ngOnInit() {
  }

  async ionViewDidEnter() {
    this.activatedRoute.params.subscribe(params => {
      if(params['pollenId']!=null){
        this.pollenId = params['pollenId'];
        this.isReturn = true;
        this.getPollenInfo();
       }
    });
  }

  async create(){
    let user = await this.accountService._getDataFromStorage();
    let stokPollen:StokPollenModel = {
      amaun_keluar:parseInt(this.outgoing_amount),
      amaun_semasa:parseInt(this.current_ammount),
      dicipta_oleh:user.no_kakitangan,
      
    };
    this.pollenUsageService.create(stokPollen,(res:StokPollenModel)=>{

    });
  }

  getPollenInfo(){
    this.pollenPrepService.getById(this.pollenId.toString(),(res:PollenPreparationModel)=>{
      this.pollen_weight = res.berat_pollen;
      this.no_pollen = res.id.toString();
    })
  }

}
