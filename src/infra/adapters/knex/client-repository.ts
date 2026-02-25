import type { Knex } from "knex";
import type { Client, ClientUpdate } from "../../../core/domain/entities/Client.js";
import type { ClientRepository } from "../../../core/application/repositories/client-repository.js";

export class KnexClientRepository implements ClientRepository {
    constructor(
        private readonly db: Knex
    ) { }

    async create(client: Client): Promise<Client | null> {
        return await this.db("clients").insert({
            id: client.id,
            company_id: client.company_id,
            name: client.name,
            email: client.email,
            document: client.document,
            phone: client.phone,
            is_whatsapp: client.is_whatsapp,
            country: client.country,
            address: client.address,
            number: client.number,
            city: client.city,
            neighborhood: client.neighborhood,
            state: client.state,
            zipcode: client.zipcode,
            complement: client.complement,
            status: client.status,
        });
    }

    async update(client: ClientUpdate): Promise<ClientUpdate | null> {
        const { company_id, ...updateData } = client;
        return await this.db("clients").where({ id: client.id, company_id }).update(updateData);
    }

    async delete(id: number, companyId: number): Promise<boolean> {
        return await this.db("clients").where({ id, company_id: companyId }).update({ status: false });
    }

    async getById(id: number, companyId: number): Promise<Client | null> {
        return await this.db("clients").where({ id, company_id: companyId }).first();
    }

    async getAll(page: number, limit: number, companyId: number, search?: string): Promise<Client[]> {
        return await this.db("clients").where({ status: true, company_id: companyId }).limit(limit).offset((page - 1) * limit);
    }

    async count(companyId: number, search?: string): Promise<number> {
        return await this.db("clients").where({ status: true, company_id: companyId }).count();
    }

    async getByEmail(email: string, companyId: number): Promise<Client | null> {
        return await this.db("clients").where({ email, company_id: companyId }).first();
    }
}