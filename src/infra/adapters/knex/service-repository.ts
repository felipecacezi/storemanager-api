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
            name: service.name,
            description: service.description,
            service_price: service.service_price,
            status: service.status,
        });
    }

    async update(service: ServiceUpdate): Promise<ServiceUpdate | null> {
        return await this.db("services").where({ id: service.id }).update(service);
    }

    async delete(id: number): Promise<boolean> {
        return await this.db("services").where({ id }).update({ status: false });
    }

    async getById(id: number): Promise<Service | null> {
        return await this.db("services").where({ id }).first();
    }

    async getAll(page: number, limit: number, search?: string): Promise<Service[]> {
        return await this.db("services").where({ status: true }).limit(limit).offset((page - 1) * limit);
    }

    async count(search?: string): Promise<number> {
        return await this.db("services").where({ status: true }).count();
    }

    async getByName(name: string): Promise<Service | null> {
        return await this.db("services").where({ name }).first();
    }
}
