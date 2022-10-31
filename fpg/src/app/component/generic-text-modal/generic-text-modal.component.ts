import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-generic-text-modal',
  templateUrl: './generic-text-modal.component.html',
  styleUrls: ['./generic-text-modal.component.scss'],
})
export class GenericTextModalComponent implements OnInit {
  @Input() value:String;
  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
  }

  dismiss(){
    this.modalCtrl.dismiss();
  }

}
