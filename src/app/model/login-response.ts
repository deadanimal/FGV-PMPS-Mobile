export interface LoginResponseModel {
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
    email_verified_at?: string;
    created_at: Date;
    updated_at: Date;
}
