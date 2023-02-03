import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stok-pollen-list',
  templateUrl: './stok-pollen-list.page.html',
  styleUrls: ['./stok-pollen-list.page.scss'],
})
export class StokPollenListPage implements OnInit {

  constructor(
    private router:Router,
  ) { }

  ngOnInit() {
  }
  
  returnSelectedPollen(id:number){
    this.router.navigate(
      [
        '/app/tabs/tab1/stok-pollen-form',
        {pollenId:id}
      ]
    );
  }

}
