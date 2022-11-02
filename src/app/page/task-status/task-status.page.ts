import { Component, OnInit } from '@angular/core';
import { Photo } from '@capacitor/camera';
import { UserPhoto } from 'src/app/model/user-photo';
import { AccountService } from 'src/app/service/account.service';
import { PhotoService } from 'src/app/services/photo.service';

@Component({
  selector: 'app-task-status',
  templateUrl: './task-status.page.html',
  styleUrls: ['./task-status.page.scss'],
})
export class TaskStatusPage implements OnInit {

  name:String;
  treeId:String;
  regNo:String;
  date:String;
  remark:String;
  svRemark:String;
  photo:Photo;
  userRole:String;

  constructor(
    private photoService:PhotoService,
    private accountService:AccountService,
  ) { }

  ngOnInit() {
    this.name = "Muhammad Ali Bin Abu";
    this.treeId = "FJ2-35";
    this.regNo = "2C00065B2R";
    this.date = "04/07/2022";
    this.remark = "Aktif";

    let userDetails = this.accountService.getSessionDetails();
    this.userRole = userDetails.peranan;
  }

  async takePicture() {
    this.photo = await this.photoService.addNewToGallery();
  }

  erasePicture(){
    this.photo = null;
  }

  submitTask(){
    
  }

}
