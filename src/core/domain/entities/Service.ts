export interface Service {
    id?: number;
    name: string;
    description?: string;
    service_price: number;
    status?: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface ServiceUpdate {
    id: number;
    name?: string;
    description?: string;
    service_price?: number;
    status?: boolean;
}
