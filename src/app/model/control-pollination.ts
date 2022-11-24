import { PokokResponse } from "./pokok-respons";

export interface ControlPollinationModel {
    id: number;
    no_cp: string;
    pokok_id: number;
    tandan_id: number;
    bil_pemeriksaan?: string;
    tambahan_hari?: string;
    no_pollen?: string;
    peratus_pollen?: string;
    id_sv_cp?: string;
    url_gambar?: string;
    catatan?: string;
    pengesah_id?: string;
    catatan_pengesah?: string;
    status?: string;
    kerosakans_id?: string;
    pokok?:PokokResponse;
    created_at: Date;
    updated_at: Date;
}