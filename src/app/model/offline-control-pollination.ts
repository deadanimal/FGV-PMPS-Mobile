import { PokokResponse } from "./pokok-respons";

export interface OfflineControlPollinationModel {
    id?:String;
    tandan_id:String;
    pokok_id:String;
    catatan:String;
    id_sv_cp:number;
    pengesah_id:number;
    url_gambar:string;
    url_gambar_data:string;
    defect?:string;
    no_pollen?:string;
    peratus_pollen?:string;
    pokok?:PokokResponse;
    status?:string;
    bil_pemeriksaan?:string;
    tambahan_hari?:string;
    catatan_pengesah?:string;
}
