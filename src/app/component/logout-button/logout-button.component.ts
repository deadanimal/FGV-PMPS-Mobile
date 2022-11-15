import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalService } from 'src/app/service/modal.service';
import { StorageService } from 'src/app/service/storage.service';

@Component({
  selector: 'app-logout-button',
  templateUrl: './logout-button.component.html',
  styleUrls: ['./logout-button.component.scss'],
})
export class LogoutButtonComponent implements OnInit {

  constructor(
    private storageService:StorageService,
    private router:Router,
    private modalService:ModalService,
  ) { }

  ngOnInit() {
  }

  async promptMenu(){
    this.modalService.menuPrompt().then(
      async (value)=>{
        if(value['data'] == 'logOut'){
          this.storageService.eraseAll();
          this.router.navigateByUrl('/login',{
            replaceUrl : true
          });
        }
      }
    );
  }



}
