import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TaskStatus } from 'src/app/common/task-status';
import { StokPollenModel } from 'src/app/model/stok-pollen';
import { PollenUsageService } from 'src/app/service/tasks/pollen-usage.service';

@Component({
  selector: 'app-stok-pollen-list',
  templateUrl: './stok-pollen-list.page.html',
  styleUrls: ['./stok-pollen-list.page.scss'],
})
export class StokPollenListPage implements OnInit {

  pollenUsageList:StokPollenModel[];

  constructor(
    private router:Router,
    private pollenUsageService:PollenUsageService,
  ) { }

  ngOnInit() {
    this.pollenUsageList = [];
    this.getPollenUsageList();
  }
  
  returnSelectedPollen(id:number){
    this.router.navigate(
      [
        '/app/tabs/tab1/stok-pollen-form',
        {pollenId:id}
      ]
    );
  }

  getPollenUsageList(){
    this.pollenUsageService.getAll((res:StokPollenModel[])=>{
      res.forEach(el => {
        if(el.status == TaskStatus.created){
          this.pollenUsageList.push(el);
        }
      });
    });
  }

}
