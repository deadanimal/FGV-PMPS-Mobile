import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TandanCycle } from 'src/app/common/tandan-cycle';
import { PokokResponse } from 'src/app/model/pokok-respons';
import { TandanResponse } from 'src/app/model/tandan-response';
import { TandanService } from 'src/app/service/tasks/tandan.service';
import { TreeService } from 'src/app/service/tasks/tree.service';

@Component({
  selector: 'app-finished-task',
  templateUrl: './finished-task.page.html',
  styleUrls: ['./finished-task.page.scss'],
})
export class FinishedTaskPage implements OnInit {

  treeNumber:String;
  regNo:String;
  cycle:String;
  status:String;
  age:String;
  indicator:number;
  constructor(
    private activatedRoute:ActivatedRoute,
    private tandanService: TandanService,
    private treeService: TreeService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if(params['tandanId']!=null){
        this._getTandanInfo(params['tandanId']);
      }
    });
  }

  async _getTandanInfo(tandanId:String){
    this.tandanService.getById(tandanId,(res:TandanResponse)=>{
      this.regNo = res.no_daftar;
      this.regNo = res.no_daftar;
      this.age = res.umur? res.umur.toString(): this._calculateAge(res.tarikh_daftar).toString();
      this.cycle = this._getCycleName(res).toUpperCase();
      this.status = res.status_tandan? res.status_tandan.toUpperCase():"-";
      this.indicator = this._getStage(res);
      this.treeService.getById(res.pokok_id.toString(),(treeRes:PokokResponse)=>{
        this.treeNumber = treeRes.progeny+"-"+treeRes.no_pokok;
      });
    });
  }

  _getCycleName(res:TandanResponse):String{
    let retVal:String;
    if(res.kitaran == TandanCycle.bagging){
      retVal = "Balut"
    }else if(res.kitaran == TandanCycle.cp){
      retVal = "Pendebungaan Terkawal"
    }else if(res.kitaran == TandanCycle.qc){
      retVal = "Kawalan Kualiti"
    }else if(res.kitaran == TandanCycle.harvest){
      retVal = "Tuai"
    }

    return retVal;
  }

  _getStage(res:TandanResponse):number{
    let retVal:number;
    if(res.kitaran == TandanCycle.bagging){
      retVal = 0;
    }else if(res.kitaran == TandanCycle.cp){
      if(res.status_tandan == 'aktif'){
        retVal = 2;
      }else{
        retVal = 1;
      }
    }else if(res.kitaran == TandanCycle.qc){
      retVal = 3
    }else if(res.kitaran == TandanCycle.harvest){
      if(res.status_tandan == 'aktif'){
        retVal = 5;
      }else{
        retVal = 4;
      }
    }

    return retVal;
  }

  _calculateAge(prvDate:string){
    let currentDate = Date.parse(this.datePipe.transform(Date.now(),"yyyy-MM-dd"));
    let prevDate = Date.parse(prvDate);
    let retVal = (currentDate - prevDate)/1000/60/60/24;
    return retVal;
  }

}
