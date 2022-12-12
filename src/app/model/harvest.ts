import { PokokResponse } from "./pokok-respons";

export interface HarvestModel {
    id: number;
    no_harvest?: string;
    pokok_id: number;
    tandan_id: number;
    berat_tandan?: string;
    catatan?: string;
    id_sv_harvest?: number;
    url_gambar?: string;
    pengesah_id?: number;
    catatan_pengesah?: string;
    jumlah_tandan?: string;
    status?: string;
    kerosakans_id?: string;
    pokok?:PokokResponse;
    created_at: Date;
    updated_at: Date;
    jenis: string;
}