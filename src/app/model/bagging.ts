import { PokokResponse } from "./pokok-respons";

export interface BaggingModel {
    id: number;
    no_bagging?: string;
    pokok_id: number;
    tandan_id: number;
    url_gambar?: string;
    id_sv_balut?: number;
    catatan?: string;
    pengesah_id?: string;
    catatan_pengesah?: string;
    status?: string;
    kerosakans_id?: string;
    pokok?:PokokResponse;
    created_at: Date;
    updated_at: Date;
}
