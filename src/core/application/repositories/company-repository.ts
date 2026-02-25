import type { Company, CompanyUpdate } from "../../domain/entities/Company.js";

export interface CompanyRepository {
    create(company: Company): Promise<Company | null>;
    update(company: CompanyUpdate): Promise<CompanyUpdate | null>;
    delete(id: number): Promise<boolean>;
    getById(id: number): Promise<Company | null>;
    getAll(page: number, limit: number, search?: string): Promise<Company[]>;
    count(search?: string): Promise<number>;
    getByEmail(email: string): Promise<Company | null>;
}