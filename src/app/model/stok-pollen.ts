import { PokokResponse } from "./pokok-respons";

export interface StokPollenModel {
    id?: number;
    pollen_id?: number;
    amaun_keluar?: number;
    amaun_kembali?: number;
    amaun_semasa?: number;
    dicipta_oleh?: string;
    dikemaskini_oleh?: string;
    status?: string;
    created_at?: Date;
    updated_at?: Date;
}