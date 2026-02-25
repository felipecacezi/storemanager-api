import type { Knex } from "knex";
import type { Company, CompanyUpdate } from "../../../core/domain/entities/Company.js";
import type { CompanyRepository } from "../../../core/application/repositories/company-repository.js";

export class KnexCompanyRepository implements CompanyRepository {
    constructor(
        private readonly db: Knex
    ) { }

    async create(company: Company): Promise<Company | null> {
        return await this.db("companies").insert({
            id: company.id,
            document: company.document,
            email: company.email,
            phone: company.phone,
            country: company.country,
            address: company.address,
            number: company.number,
            city: company.city,
            neighborhood: company.neighborhood,
            state: company.state,
            zipcode: company.zipcode,
            complement: company.complement,
            status: company.status,
        });
    }

    async update(company: CompanyUpdate): Promise<CompanyUpdate | null> {
        return await this.db("companies").where({ id: company.id }).update(company);
    }

    async delete(id: number): Promise<boolean> {
        return await this.db("companies").where({ id }).update({ status: false });
    }

    async getById(id: number): Promise<Company | null> {
        return await this.db("companies").where({ id }).first();
    }

    async getAll(page: number, limit: number, search?: string): Promise<Company[]> {
        return await this.db("companies").where({ status: true }).limit(limit).offset((page - 1) * limit);
    }

    async count(search?: string): Promise<number> {
        return await this.db("companies").where({ status: true }).count();
    }

    async getByEmail(email: string): Promise<Company | null> {
        return await this.db("companies").where({ email }).first();
    }
}
