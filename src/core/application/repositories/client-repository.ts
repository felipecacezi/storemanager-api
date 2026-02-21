import type { Client, ClientUpdate } from "../../domain/entities/Client.js";

export interface ClientRepository {
    create(client: Client): Promise<Client | null>;
    update(client: ClientUpdate): Promise<ClientUpdate | null>;
    delete(id: number): Promise<boolean>;
    getById(id: number): Promise<Client | null>;
    getAll(page: number, limit: number, search?: string): Promise<Client[]>;
    count(search?: string): Promise<number>;
    getByEmail(email: string): Promise<Client | null>;
}
