export interface User {
    id?: number;
    name: string;
    email: string;
    password?: string;
    token?: string;
}

export interface UserUpdate {
    id: number;
    name?: string;
    email?: string;
    password?: string;
    token?: string;
}