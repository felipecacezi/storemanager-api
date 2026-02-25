import type { KnexCompanyRepository } from "../../../infra/adapters/knex/company-repository.js";
import type { Company } from "../../domain/entities/Company.js";
import { ErrorMessages } from "../../domain/erros/error-mesages.js";
import { z } from "zod";

export class CreateCompanyUseCase {
    constructor(
        private companyRepository: KnexCompanyRepository
    ) { }

    async execute(company: Company) {
        const schema = z.object({
            document: z.string({ message: ErrorMessages.COMPANY_DOCUMENT_REQUIRED })
                .min(1, ErrorMessages.COMPANY_DOCUMENT_REQUIRED),
            email: z.string({ message: ErrorMessages.COMPANY_EMAIL_REQUIRED })
                .min(1, ErrorMessages.COMPANY_EMAIL_REQUIRED)
                .email(ErrorMessages.COMPANY_EMAIL_INVALID),
            phone: z.string({ message: ErrorMessages.COMPANY_PHONE_REQUIRED })
                .min(1, ErrorMessages.COMPANY_PHONE_REQUIRED),
        });

        const result = schema.safeParse(company);
        if (!result.success) {
            throw new Error(result.error.issues[0].message);
        }

        const companyExists = await this.companyRepository.getByEmail(result.data.email);
        if (companyExists) {
            throw new Error(ErrorMessages.COMPANY_ALREADY_EXISTS);
        }

        return await this.companyRepository.create(company);
    }
}
