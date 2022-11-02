export interface TaskResponseModel {
  id: number;
  tandan_id: number;
  jenis: string;
  catatan: string;
  status: string;
  tarikh: string;
  petugas_id: number;
  catatan_petugas: string;
  pengesah_id?: any;
  catatan_pengesah?: any;
  tarikh_pengesahan?: any;
  url_gambar: string;
  created_at: string;
  updated_at: string;
}