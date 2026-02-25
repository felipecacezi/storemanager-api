export interface User {
    id?: number;
    company_id?: number;
    name: string;
    email: string;
    password?: string;
    token?: string;
}

export interface UserUpdate {
    id: number;
    company_id?: number;
    name?: string | undefined;
    email?: string | undefined;
    password?: string | undefined;
    confirm_password?: string | undefined;
    token?: string | undefined;
}