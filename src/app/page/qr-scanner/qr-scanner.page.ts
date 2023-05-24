import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.page.html',
  styleUrls: ['./qr-scanner.page.scss'],
})
export class QrScannerPage implements OnInit {

  treeNum:String;
  taskId:String;
  returnUrl:String;
  task:String;
  expactedTandanId:String;
  redirect:String;
  var1:String;

  constructor(
    private activatedRoute:ActivatedRoute,
    private router:Router,
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if(params['treeNum']!=null){
        this.treeNum = params['treeNum'];
      }
      if(params['taskId']!=null){
        this.taskId = params['taskId'];
      }
      if(params['expactedTandanId']!=null){
        this.expactedTandanId = params['expactedTandanId'];
      }
      if(params['redirect']!=null){
        this.redirect = params['redirect'];
      }
      if(params['var1']!=null){
        this.var1 = params['var1'];
      }
      
      if(params['returnUrl']!=null){
        this.returnUrl = params['returnUrl'];
      }else{
        this.returnUrl = 'app/tabs/tab1/start-work-find';
      }

      if(params['task']!=null){
        this.task = params['task'];
      }

      console.log(this.returnUrl);
    });
  }

  ionViewWillEnter(){
    this.didUserGrantPermission();
    setTimeout(() => {
      this.startScan();
    }, 500);
  }

  async ionViewWillLeave(){
    document.querySelector('body').classList.remove('scanner-active');
    await BarcodeScanner.stopScan();
  }

  startScan = async () => {
    document.querySelector('body').classList.add('scanner-active');
    // Check camera permission
    // This is just a simple example, check out the better checks below
    await BarcodeScanner.checkPermission({ force: true });
  
    // make background of WebView transparent
    // note: if you are using ionic this might not be enough, check below
    BarcodeScanner.hideBackground();
  
    const result = await BarcodeScanner.startScan(); // start scanning and wait for a result
  
    // if the result has content
    if (result.hasContent) {
      // console.log(result.content); // log the raw scanned content
      let scanResult = result.content;
      if(this.task == 'Balut' && this.returnUrl.indexOf('start-work-find')>0){
        scanResult = scanResult.replace('https://fgv.prototype.com.my/pengurusan-pokok-induk/tandan/edit/',""); // for tandan
      }else if(this.task == 'Balut' && this.returnUrl.indexOf('main-task')>0){
        scanResult = scanResult.replace('https://fgv.prototype.com.my/pengurusan-pokok-induk/pokok/edit/',""); // for pokok
      }else{
        scanResult = scanResult.replace('https://fgv.prototype.com.my/pengurusan-pokok-induk/pokok/edit/',""); // for pokok
        scanResult = scanResult.replace('https://fgv.prototype.com.my/pengurusan-pokok-induk/tandan/edit/',""); // for tandan
      }
      if(this.treeNum!=null){
        this.router.navigate(
          [
            this.returnUrl,
            {
              task:this.task,
              treeNum:this.treeNum,
              regNo:scanResult,
              taskId:this.taskId,
              scanInput:scanResult
            }
          ]
        );
      }else if(this.expactedTandanId != null){
        this.router.navigate(
          [
            this.returnUrl,
            {
              taskType:this.task,
              taskId:this.taskId,
              scanInput:scanResult,
              expactedTandanId:this.expactedTandanId,
              var1:this.var1,
              redirect:this.redirect,
            }
          ]
        );
      }else if(this.task != null){
        this.router.navigate(
          [
            this.returnUrl,
            {
              task:this.task,
              taskId:this.taskId,
              scanInput:scanResult
            }
          ]
        );
      }else{
        this.router.navigate(
          [
            this.returnUrl,
            {
              treeNum:scanResult,
              taskId:this.taskId,
              scanInput:scanResult,
              redirect:this.redirect,
            }
          ]
        );
      }
    }
    document.querySelector('body').classList.remove('scanner-active');
  };

  didUserGrantPermission = async () => {
    // check if user already granted permission
    const status = await BarcodeScanner.checkPermission({ force: false });
  
    if (status.granted) {
      // user granted permission
      return true;
    }
  
    if (status.denied) {
      // user denied permission
      return false;
    }
  
    if (status.asked) {
      // system requested the user for permission during this call
      // only possible when force set to true
    }
  
    if (status.neverAsked) {
      // user has not been requested this permission before
      // it is advised to show the user some sort of prompt
      // this way you will not waste your only chance to ask for the permission
      const c = confirm('We need your permission to use your camera to be able to scan barcodes');
      if (!c) {
        return false;
      }
    }
  
    if (status.restricted || status.unknown) {
      // ios only
      // probably means the permission has been denied
      return false;
    }
  
    // user has not denied permission
    // but the user also has not yet granted the permission
    // so request it
    const statusRequest = await BarcodeScanner.checkPermission({ force: true });
  
    if (statusRequest.asked) {
      // system requested the user for permission during this call
      // only possible when force set to true
    }
  
    if (statusRequest.granted) {
      // the user did grant the permission now
      return true;
    }
  
    // user did not grant the permission, so he must have declined the request
    return false;
  };

}
