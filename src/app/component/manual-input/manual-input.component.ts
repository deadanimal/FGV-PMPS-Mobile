import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-manual-input',
  templateUrl: './manual-input.component.html',
  styleUrls: ['./manual-input.component.scss'],
})
export class ManualInputComponent implements OnInit {

  @Input() label:String;
  @Input() value:String; // default value
  input1:string;

  constructor(
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {}

  btnClick(forms:NgForm){
    this.modalCtrl.dismiss(forms);
  }

}
