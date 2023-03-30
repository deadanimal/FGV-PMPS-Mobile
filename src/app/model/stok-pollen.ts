import { PokokResponse } from "./pokok-respons";
import { PollenPreparationModel } from "./pollen-preparation-model";

export interface StokPollenModel {
    id?: number;
    pollen_id?: number;
    amaun_keluar?: number;
    amaun_kembali?: number;
    amaun_semasa?: number;
    dicipta_oleh?: string;
    dikemaskini_oleh?: string;
    status?: string;
    blok?: string;
    berat?: string;
    pokok?:PokokResponse;
    created_at?: Date;
    updated_at?: Date;
    pollen?:PollenPreparationModel
}