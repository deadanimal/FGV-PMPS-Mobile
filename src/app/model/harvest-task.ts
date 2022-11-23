import { PokokResponse } from "./pokok-respons";

export interface HarvestTask {
    id: number;
    no_harvest?: string;
    pokok_id: number;
    tandan_id: number;
    berat_tandan?: string;
    catatan?: string;
    id_sv_harvest?: string;
    url_gambar?: string;
    pengesah_id?: string;
    catatan_pengesah?: string;
    jumlah_tandan?: string;
    status?: string;
    pokok?:PokokResponse;
    created_at: Date;
    updated_at: Date;
    jenis: string;
}