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
            company_id: serviceOrder.company_id,
            client_id: serviceOrder.client_id,
            description: serviceOrder.description,
            service_id: serviceOrder.service_id,
            product_id: serviceOrder.product_id,
            status: serviceOrder.status,
            service_status: serviceOrder.service_status,
        });
    }

    async update(serviceOrder: ServiceOrderUpdate): Promise<ServiceOrderUpdate | null> {
        const { company_id, ...updateData } = serviceOrder;
        return await this.db("service_orders").where({ id: serviceOrder.id, company_id }).update(updateData);
    }

    async delete(id: number, companyId: number): Promise<boolean> {
        return await this.db("service_orders").where({ id, company_id: companyId }).update({ status: false });
    }

    async getById(id: number, companyId: number): Promise<ServiceOrder | null> {
        return await this.db("service_orders").where({ id, company_id: companyId }).first();
    }

    async getAll(page: number, limit: number, companyId: number, search?: string): Promise<ServiceOrder[]> {
        return await this.db("service_orders")
            .where({ status: true, company_id: companyId })
            .limit(limit)
            .offset((page - 1) * limit);
    }

    async count(companyId: number, search?: string): Promise<number> {
        return await this.db("service_orders").where({ status: true, company_id: companyId }).count();
    }
}
