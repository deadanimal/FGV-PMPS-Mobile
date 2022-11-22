export interface Tandan {
    id: number;
    no_daftar: string;
    tarikh_daftar: string;
    pokok_id: number;
    kitaran: string;
    deskripsi_kitaran?: any;
    status_tandan: string;
    catatan?: any;
    file?: any;
    umur?: any;
    created_at: Date;
    updated_at: Date;
}

export interface Pokok {
    id: number;
    no_pokok: string;
    jantina: string;
    baka: string;
    progeny: string;
    blok: string;
    trial?: any;
    status_pokok: string;
    induk?: any;
    catatan?: any;
    user_id: number;
    created_at: Date;
    updated_at: Date;
}

export interface QcSearchResponse {
    id: number;
    no_bagging?: any;
    pokok_id: number;
    tandan_id: number;
    url_gambar: string;
    id_sv_balut: number;
    catatan: string;
    pengesah_id?: any;
    catatan_pengesah?: any;
    status?: any;
    created_at: Date;
    updated_at: Date;
    tandan: Tandan;
    pokok: Pokok;
}
