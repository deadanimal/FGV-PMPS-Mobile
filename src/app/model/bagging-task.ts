import { PokokResponse } from "./pokok-respons";

export interface BaggingTask {
    id: number;
    no_bagging?: string;
    pokok_id: number;
    tandan_id: number;
    url_gambar?: string;
    id_sv_balut?: string;
    catatan?: string;
    pengesah_id?: string;
    catatan_pengesah?: string;
    status?: string;
    pokok?:PokokResponse;
    created_at: Date;
    updated_at: Date;
}
