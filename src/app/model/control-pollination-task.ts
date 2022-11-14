export interface ControlPollinationTask {
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
    created_at: Date;
    updated_at: Date;
}