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
        const query = this.db("vendors").where({ company_id: companyId });

        const trimmedSearch = search?.trim();
        if (trimmedSearch) {
            const likeTerm = `%${trimmedSearch}%`;
            query.andWhere((qb) => {
                qb.where("name", "like", likeTerm)
                    .orWhere("email", "like", likeTerm)
                    .orWhere("document", "like", likeTerm)
                    .orWhere("phone", "like", likeTerm);
            });
        }

        return await query
            .orderBy("id", "desc")
            .limit(limit)
            .offset((page - 1) * limit);
    }

    async count(companyId: number, search?: string): Promise<number> {
        const query = this.db("vendors").where({ company_id: companyId });

        const trimmedSearch = search?.trim();
        if (trimmedSearch) {
            const likeTerm = `%${trimmedSearch}%`;
            query.andWhere((qb) => {
                qb.where("name", "like", likeTerm)
                    .orWhere("email", "like", likeTerm)
                    .orWhere("document", "like", likeTerm)
                    .orWhere("phone", "like", likeTerm);
            });
        }

        const result: any = await query.count({ count: "*" }).first();
        return Number(result?.count ?? 0);
    }

    async getByEmail(email: string, companyId: number): Promise<Vendor | null> {
        return await this.db("vendors").where({ email, company_id: companyId }).first();
    }
}
