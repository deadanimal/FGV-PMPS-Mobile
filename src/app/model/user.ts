import { HarvestModel } from "./harvest";
import { QualityControlModel } from "./quality-control";

export interface User {
    id: number;
    nama: string;
    no_kakitangan: string;
    no_kad_pengenalan: string;
    email: string;
    kategori_petugas: string;
    no_telefon?: string;
    stesen?: string;
    blok?: string;
    luput_pwd?: string;
    peranan: string;
    quality_control?: QualityControlModel[];
    harvest?: HarvestModel[];
    email_verified_at?: string;
    created_at?: Date;
    updated_at?: Date;
}