import type { KnexCompanyRepository } from "../../../infra/adapters/knex/company-repository.js";
import type { CompanyUpdate } from "../../domain/entities/Company.js";
import { ErrorMessages } from "../../domain/erros/error-mesages.js";
import { z } from "zod";

export class UpdateCompanyUseCase {
    constructor(
        private companyRepository: KnexCompanyRepository
    ) { }

    async execute(company: CompanyUpdate) {
        const schema = z.object({
            id: z.number({
                message: ErrorMessages.COMPANY_ID_REQUIRED,
                invalid_type_error: ErrorMessages.COMPANY_ID_REQUIRED
            })
        });

        const result = schema.safeParse(company);
        if (!result.success) {
            throw new Error(result.error.issues[0].message);
        }

        const companyExists = await this.companyRepository.getById(result.data.id);
        if (!companyExists) {
            throw new Error(ErrorMessages.COMPANY_NOT_FOUND);
        }

        return await this.companyRepository.update(company);
    }
}
