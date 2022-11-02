export interface TandanResponse {
    id: number;
    no_daftar: string;
    tarikh_daftar: string;
    pokok_id: number;
    kitaran?: string;
    deskripsi_kitaran?: string;
    status_tandan?: string;
    catatan?: string;
    file?: string;
    umur: number;
    created_at: Date;
    updated_at: Date;
}