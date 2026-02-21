import type { ServiceOrder, ServiceOrderUpdate } from "../../domain/entities/ServiceOrder.js";

export interface ServiceOrderRepository {
    create(serviceOrder: ServiceOrder): Promise<ServiceOrder | null>;
    update(serviceOrder: ServiceOrderUpdate): Promise<ServiceOrderUpdate | null>;
    delete(id: number): Promise<boolean>;
    getById(id: number): Promise<ServiceOrder | null>;
    getAll(page: number, limit: number, search?: string): Promise<ServiceOrder[]>;
    count(search?: string): Promise<number>;
}
