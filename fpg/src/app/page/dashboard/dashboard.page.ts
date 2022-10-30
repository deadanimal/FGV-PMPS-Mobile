import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  constructor(
    private router:Router,
  ) { }

  ngOnInit() {
  }

  task(task:String){
    this.router.navigate(['app/tabs/tab1/main-task',{task:task}]);
  }

}
