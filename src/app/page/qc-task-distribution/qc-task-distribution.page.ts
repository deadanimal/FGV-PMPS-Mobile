import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from 'src/app/service/modal.service';

@Component({
  selector: 'app-qc-task-distribution',
  templateUrl: './qc-task-distribution.page.html',
  styleUrls: ['./qc-task-distribution.page.scss'],
})
export class QcTaskDistributionPage implements OnInit {

  taskId:String;
  constructor(
    private activatedRoute:ActivatedRoute,
    private modalService:ModalService,
    private router:Router,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.taskId = params['taskId'];
    });
  }

  ionViewDidEnter(){
    this._getTask();
  }

  _getTask(){}

  select(){
    this.modalService.successPrompt("Anda telah mengagihkan tugas kepada pekerja yang dipilih").then(()=>{
      this.router.navigate(
        [
          '/app/tabs/tab1',
          {
          }
        ],
        {
          replaceUrl : true
        }
      );
    });
  }
}
