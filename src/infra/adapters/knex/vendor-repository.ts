import type { Knex } from "knex";
import type { Vendor, VendorUpdate } from "../../../core/domain/entities/Vendor.js";
import type { VendorRepository } from "../../../core/application/repositories/vendor-repository.js";

export class KnexVendorRepository implements VendorRepository {
    constructor(
        private readonly db: Knex
    ) { }

    async create(vendor: Vendor): Promise<Vendor | null> {
        return await this.db("vendors").insert({
            id: vendor.id,
            company_id: vendor.company_id,
            name: vendor.name,
            email: vendor.email,
            document: vendor.document,
            phone: vendor.phone,
            is_whatsapp: vendor.is_whatsapp,
            country: vendor.country,
            address: vendor.address,
            number: vendor.number,
            city: vendor.city,
            neighborhood: vendor.neighborhood,
            state: vendor.state,
            zipcode: vendor.zipcode,
            complement: vendor.complement,
            status: vendor.status,
        });
    }

    async update(vendor: VendorUpdate): Promise<VendorUpdate | null> {
        const { company_id, ...updateData } = vendor;
        return await this.db("vendors").where({ id: vendor.id, company_id }).update(updateData);
    }

    async delete(id: number, companyId: number): Promise<boolean> {
        return await this.db("vendors").where({ id, company_id: companyId }).update({ status: false });
    }

    async getById(id: number, companyId: number): Promise<Vendor | null> {
        return await this.db("vendors").where({ id, company_id: companyId }).first();
    }

    async getAll(page: number, limit: number, companyId: number, search?: string): Promise<Vendor[]> {
        return await this.db("vendors").where({ status: true, company_id: companyId }).limit(limit).offset((page - 1) * limit);
    }

    async count(companyId: number, search?: string): Promise<number> {
        return await this.db("vendors").where({ status: true, company_id: companyId }).count();
    }

    async getByEmail(email: string, companyId: number): Promise<Vendor | null> {
        return await this.db("vendors").where({ email, company_id: companyId }).first();
    }
}
