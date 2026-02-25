export interface Client {
    id?: number;
    company_id: number;
    name: string;
    email: string;
    document: string;
    phone: string;
    is_whatsapp?: boolean;
    country?: string;
    address?: string;
    number?: string;
    city?: string;
    neighborhood?: string;
    state?: string;
    zipcode?: string;
    complement?: string;
    status?: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface ClientUpdate {
    id: number;
    company_id: number;
    name?: string;
    email?: string;
    document?: string;
    phone?: string;
    is_whatsapp?: boolean;
    country?: string;
    address?: string;
    number?: string;
    city?: string;
    neighborhood?: string;
    state?: string;
    zipcode?: string;
    complement?: string;
    status?: boolean;
}
