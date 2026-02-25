import type { Vendor, VendorUpdate } from "../../domain/entities/Vendor.js";

export interface VendorRepository {
    create(vendor: Vendor): Promise<Vendor | null>;
    update(vendor: VendorUpdate): Promise<VendorUpdate | null>;
    delete(id: number, companyId: number): Promise<boolean>;
    getById(id: number, companyId: number): Promise<Vendor | null>;
    getAll(page: number, limit: number, companyId: number, search?: string): Promise<Vendor[]>;
    count(companyId: number, search?: string): Promise<number>;
    getByEmail(email: string, companyId: number): Promise<Vendor | null>;
}
