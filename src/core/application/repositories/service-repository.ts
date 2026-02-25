import type { Service, ServiceUpdate } from "../../domain/entities/Service.js";

export interface ServiceRepository {
    create(service: Service): Promise<Service | null>;
    update(service: ServiceUpdate): Promise<ServiceUpdate | null>;
    delete(id: number, companyId: number): Promise<boolean>;
    getById(id: number, companyId: number): Promise<Service | null>;
    getAll(page: number, limit: number, companyId: number, search?: string): Promise<Service[]>;
    count(companyId: number, search?: string): Promise<number>;
    getByName(name: string, companyId: number): Promise<Service | null>;
}
