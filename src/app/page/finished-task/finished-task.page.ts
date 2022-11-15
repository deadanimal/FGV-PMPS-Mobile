import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  loadingModal:any;
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
      this.cycle = res.kitaran.toUpperCase();
      this.status = res.status_tandan? res.status_tandan.toUpperCase():"-";
      this.treeService.getById(res.pokok_id.toString(),(treeRes:PokokResponse)=>{
        this.treeNumber = treeRes.no_pokok;
      });
    });
  }

  _calculateAge(prvDate:string){
    let currentDate = Date.parse(this.datePipe.transform(Date.now(),"yyyy-MM-dd"));
    let prevDate = Date.parse(prvDate);
    let retVal = (currentDate - prevDate)/1000/60/60/24;
    return retVal;
  }

}
