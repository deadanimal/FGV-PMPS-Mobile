import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tree-info',
  templateUrl: './tree-info.page.html',
  styleUrls: ['./tree-info.page.scss'],
})
export class TreeInfoPage implements OnInit {

  treeNumber:String;
  sex:String;
  breed:String;
  progeny:String;
  block:String;
  trial:String;
  status:String;

  constructor() { }

  ngOnInit() {
    this.treeNumber = "FJ2-35";
    this.sex = "FatherPalm";
    this.breed = "Platinum";
    this.progeny = "TK 46";
    this.block = "25C1";
    this.trial = "YGB2";
    this.status = "Aktif";
  }

}
