export interface Service {
    id?: number;
    company_id: number;
    name: string;
    description?: string;
    service_price: number;
    status?: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface ServiceUpdate {
    id: number;
    company_id: number;
    name?: string;
    description?: string;
    service_price?: number;
    status?: boolean;
}
