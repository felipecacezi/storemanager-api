import type { ServiceOrder, ServiceOrderUpdate } from "../../domain/entities/ServiceOrder.js";

export interface ServiceOrderRepository {
    create(serviceOrder: ServiceOrder): Promise<ServiceOrder | null>;
    update(serviceOrder: ServiceOrderUpdate): Promise<ServiceOrderUpdate | null>;
    delete(id: number, companyId: number): Promise<boolean>;
    getById(id: number, companyId: number): Promise<ServiceOrder | null>;
    getAll(page: number, limit: number, companyId: number, search?: string): Promise<ServiceOrder[]>;
    count(companyId: number, search?: string): Promise<number>;
}
