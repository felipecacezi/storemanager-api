import type { Service, ServiceUpdate } from "../../domain/entities/Service.js";

export interface ServiceRepository {
    create(service: Service): Promise<Service | null>;
    update(service: ServiceUpdate): Promise<ServiceUpdate | null>;
    delete(id: number): Promise<boolean>;
    getById(id: number): Promise<Service | null>;
    getAll(page: number, limit: number, search?: string): Promise<Service[]>;
    count(search?: string): Promise<number>;
    getByName(name: string): Promise<Service | null>;
}
