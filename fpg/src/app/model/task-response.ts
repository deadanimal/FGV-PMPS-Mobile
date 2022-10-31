export interface TaskResponseModel {
  id: number
  tandan_id: number
  jenis: string
  aktiviti: string
  status: string
  tarikh: string
  pengesah_id?: number
  tarikh_pengesahan: any
  petugas_id: number
  created_at: string
  updated_at: string
}