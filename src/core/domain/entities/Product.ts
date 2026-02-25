export interface Product {
    id?: number;
    company_id: number;
    name: string;
    description?: string;
    cost_price: number;
    sell_price: number;
    inventory?: number;
    status?: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface ProductUpdate {
    id: number;
    company_id: number;
    name?: string;
    description?: string;
    cost_price?: number;
    sell_price?: number;
    inventory?: number;
    status?: boolean;
}
