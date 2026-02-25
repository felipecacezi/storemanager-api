export interface Company {
    id?: number;
    document: string;
    email: string;
    phone: string;
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

export interface CompanyUpdate {
    id: number;
    document?: string;
    email?: string;
    phone?: string;
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