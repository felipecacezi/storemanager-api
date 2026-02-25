import type { Client, ClientUpdate } from "../../domain/entities/Client.js";

export interface ClientRepository {
    create(client: Client): Promise<Client | null>;
    update(client: ClientUpdate): Promise<ClientUpdate | null>;
    delete(id: number, companyId: number): Promise<boolean>;
    getById(id: number, companyId: number): Promise<Client | null>;
    getAll(page: number, limit: number, companyId: number, search?: string): Promise<Client[]>;
    count(companyId: number, search?: string): Promise<number>;
    getByEmail(email: string, companyId: number): Promise<Client | null>;
}
