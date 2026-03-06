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
        const query = this.db("clients").where({ company_id: companyId });

        const trimmedSearch = search?.trim();
        if (trimmedSearch) {
            const likeTerm = `%${trimmedSearch}%`;
            query.andWhere((qb) => {
                qb.where("name", "like", likeTerm)
                    .orWhere("email", "like", likeTerm)
                    .orWhere("document", "like", likeTerm)
                    .orWhere("phone", "like", likeTerm);
            });
        }

        return await query
            .orderBy("id", "desc")
            .limit(limit)
            .offset((page - 1) * limit);
    }

    async count(companyId: number, search?: string): Promise<number> {
        const query = this.db("clients").where({ company_id: companyId });

        const trimmedSearch = search?.trim();
        if (trimmedSearch) {
            const likeTerm = `%${trimmedSearch}%`;
            query.andWhere((qb) => {
                qb.where("name", "like", likeTerm)
                    .orWhere("email", "like", likeTerm)
                    .orWhere("document", "like", likeTerm)
                    .orWhere("phone", "like", likeTerm);
            });
        }

        const result: any = await query.count({ count: "*" }).first();
        return Number(result?.count ?? 0);
    }

    async getByEmail(email: string, companyId: number): Promise<Client | null> {
        return await this.db("clients").where({ email, company_id: companyId }).first();
    }
}