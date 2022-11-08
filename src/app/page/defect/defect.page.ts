import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-defect',
  templateUrl: './defect.page.html',
  styleUrls: ['./defect.page.scss'],
})
export class DefectPage implements OnInit {

  defect:string = "z";
  constructor() { }

  ngOnInit() {
  }

  handleChange(e) {
    console.log(e.detail.value);
    this.defect = e.detail.value;
    console.log(this.defect)
  }

}
