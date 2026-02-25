export type ServiceOrderStatus = 'pendente' | 'em_andamento' | 'concluido' | 'finalizado' | 'cancelado';

export interface ServiceOrder {
    id?: number;
    company_id: number;
    client_id: number;
    description: string;
    service_id: number;
    product_id: number;
    status?: boolean;
    service_status?: ServiceOrderStatus;
    created_at?: string;
    updated_at?: string;
}

export interface ServiceOrderUpdate {
    id: number;
    company_id: number;
    client_id?: number;
    description?: string;
    service_id?: number;
    product_id?: number;
    status?: boolean;
    service_status?: ServiceOrderStatus;
}
