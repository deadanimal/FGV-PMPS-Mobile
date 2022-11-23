import { PokokResponse } from "./pokok-respons";

export interface QualityControlTask {
    id: number;
    no_qc?: string;
    pokok_id: number;
    tandan_id: number;
    status_bunga?: string;
    status_qc?: string;
    id_sv_qc?: string;
    url_gambar?: string;
    catatan?: string;
    jum_bagging?: string;
    jum_bagging_lulus?: string;
    jum_bagging_rosak?: string;
    peratus_rosak?: string;
    pengesah_id?: string;
    catatan_pengesah?: string;
    status?: string;
    pokok?:PokokResponse;
    created_at: Date;
    updated_at: Date;
}