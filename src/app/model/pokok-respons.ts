export interface PokokResponse {
    id: number;
    no_pokok: string;
    jantina: string;
    baka: string;
    progeny: string;
    blok: string;
    trial: string;
    status_pokok: string;
    induk?: string;
    user_id: number;
    created_at?: Date;
    in_app_name?:string;
    updated_at: Date;
}
