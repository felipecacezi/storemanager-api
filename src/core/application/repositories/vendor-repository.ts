import type { Vendor, VendorUpdate } from "../../domain/entities/Vendor.js";

export interface VendorRepository {
    create(vendor: Vendor): Promise<Vendor | null>;
    update(vendor: VendorUpdate): Promise<VendorUpdate | null>;
    delete(id: number): Promise<boolean>;
    getById(id: number): Promise<Vendor | null>;
    getAll(page: number, limit: number, search?: string): Promise<Vendor[]>;
    count(search?: string): Promise<number>;
    getByEmail(email: string): Promise<Vendor | null>;
}
