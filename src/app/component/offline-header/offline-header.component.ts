import { Component, OnInit } from '@angular/core';
import { fromEvent, merge, Observable, of } from 'rxjs';
import { AppMode } from 'src/app/common/app-mode';
import { map } from 'rxjs/operators';
import { StorageService } from 'src/app/service/storage.service';
import { OfflineModeService } from 'src/app/service/offline-mode.service';

@Component({
  selector: 'app-offline-header',
  templateUrl: './offline-header.component.html',
  styleUrls: ['./offline-header.component.scss'],
})
export class OfflineHeaderComponent implements OnInit {

  mode:AppMode;
  public appIsOnline$: Observable<boolean>;
  public appIsSync: Observable<boolean>;
  constructor(
    private storageService:StorageService,
    private offlineModeService:OfflineModeService,
  ) { }

  async ngOnInit() {
    this.mode = AppMode.Online;
    this.initConnectivityMonitoring();
    let hasOfflineData:Boolean = await this.storageService.get(this.storageService.offlineData);
    this.appIsOnline$.subscribe(async online => {
      let offlineModeEnabled = await this._isInOfflineMode();
      if(!offlineModeEnabled){
        if (online) {
          this.mode = AppMode.Online;
        } else {
          this.mode = AppMode.Offline;
        }
      }else{
        this.mode = AppMode.OfflineWithData
      }
    });
  }

  _isInOfflineMode(){
    return this.offlineModeService.isOfflineMode();
  }

  private initConnectivityMonitoring() {
    if (!window || !navigator || !('onLine' in navigator)) return;
    this.appIsOnline$ = merge(
      of(null),
      fromEvent(window, 'online'),
      fromEvent(window, 'offline')
    ).pipe(map(() => navigator.onLine))
  }

}
