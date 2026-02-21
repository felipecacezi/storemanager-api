import type { Knex } from "knex";
import type { ServiceOrder, ServiceOrderUpdate } from "../../../core/domain/entities/ServiceOrder.js";
import type { ServiceOrderRepository } from "../../../core/application/repositories/service-order-repository.js";

export class KnexServiceOrderRepository implements ServiceOrderRepository {
    constructor(
        private readonly db: Knex
    ) { }

    async create(serviceOrder: ServiceOrder): Promise<ServiceOrder | null> {
        return await this.db("service_orders").insert({
            id: serviceOrder.id,
            client_id: serviceOrder.client_id,
            description: serviceOrder.description,
            service_id: serviceOrder.service_id,
            product_id: serviceOrder.product_id,
            status: serviceOrder.status,
            service_status: serviceOrder.service_status,
        });
    }

    async update(serviceOrder: ServiceOrderUpdate): Promise<ServiceOrderUpdate | null> {
        return await this.db("service_orders").where({ id: serviceOrder.id }).update(serviceOrder);
    }

    async delete(id: number): Promise<boolean> {
        return await this.db("service_orders").where({ id }).update({ status: false });
    }

    async getById(id: number): Promise<ServiceOrder | null> {
        return await this.db("service_orders").where({ id }).first();
    }

    async getAll(page: number, limit: number, search?: string): Promise<ServiceOrder[]> {
        return await this.db("service_orders")
            .where({ status: true })
            .limit(limit)
            .offset((page - 1) * limit);
    }

    async count(search?: string): Promise<number> {
        return await this.db("service_orders").where({ status: true }).count();
    }
}
