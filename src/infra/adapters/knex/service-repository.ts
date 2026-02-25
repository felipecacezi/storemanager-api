import type { Knex } from "knex";
import type { Service, ServiceUpdate } from "../../../core/domain/entities/Service.js";
import type { ServiceRepository } from "../../../core/application/repositories/service-repository.js";

export class KnexServiceRepository implements ServiceRepository {
    constructor(
        private readonly db: Knex
    ) { }

    async create(service: Service): Promise<Service | null> {
        return await this.db("services").insert({
            id: service.id,
            company_id: service.company_id,
            name: service.name,
            description: service.description,
            service_price: service.service_price,
            status: service.status,
        });
    }

    async update(service: ServiceUpdate): Promise<ServiceUpdate | null> {
        const { company_id, ...updateData } = service;
        return await this.db("services").where({ id: service.id, company_id }).update(updateData);
    }

    async delete(id: number, companyId: number): Promise<boolean> {
        return await this.db("services").where({ id, company_id: companyId }).update({ status: false });
    }

    async getById(id: number, companyId: number): Promise<Service | null> {
        return await this.db("services").where({ id, company_id: companyId }).first();
    }

    async getAll(page: number, limit: number, companyId: number, search?: string): Promise<Service[]> {
        return await this.db("services").where({ status: true, company_id: companyId }).limit(limit).offset((page - 1) * limit);
    }

    async count(companyId: number, search?: string): Promise<number> {
        return await this.db("services").where({ status: true, company_id: companyId }).count();
    }

    async getByName(name: string, companyId: number): Promise<Service | null> {
        return await this.db("services").where({ name, company_id: companyId }).first();
    }
}
