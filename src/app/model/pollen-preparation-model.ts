export interface PollenPreparationModel {
    id: number;
    no_pollen: string;
    pokok_id: number;
    tandan_id: number;
    masa_masuk_pertama?: string;
    masa_keluar_pertama?: string;
    tarikh_ketuk?: string;
    masa_masuk_kedua?: string;
    masa_keluar_kedua?: string;
    tarikh_ayak?: string;
    berat_pollen?: string;
    bil_uji?: string;
    tarikh_uji?: string;
    masa_uji?: string;
    viabiliti_pollen?: string;
    tarikh_qc?: string;
    pemeriksa_id?: string;
    catatan_pemeriksa?: string;
    pengesah_id?: string;
    catatan_pengesah?: string;
    id_sv_pollen?: string;
    status_pollen?: string;
    status?: string;
    created_at: Date;
    updated_at: Date;
    jenis: string;
}