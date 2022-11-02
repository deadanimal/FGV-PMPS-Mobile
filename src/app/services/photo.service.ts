import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { UserPhoto } from '../model/user-photo';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  private _photo: UserPhoto;

  constructor() { }

  public async addNewToGallery() {
    // Take a photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
      quality: 100
    });

    this._photo = ({
      filepath: capturedPhoto.dataUrl,
      webviewPath: capturedPhoto.webPath
    });

    return capturedPhoto;
  }

  public getPhoto(){
    return this._photo;
  }
}
