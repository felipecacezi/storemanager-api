import type { KnexCompanyRepository } from "../../../infra/adapters/knex/company-repository.js";
import type { KnexUserRepository } from "../../../infra/adapters/knex/user-repository.js";
import type { Company } from "../../domain/entities/Company.js";
import { ErrorMessages } from "../../domain/erros/error-mesages.js";
import { z } from "zod";
import { CreateCompanyUseCase } from "./create-company.js";

export class CreateCompanyForUserUseCase {
    constructor(
        private readonly userRepository: KnexUserRepository,
        private readonly companyRepository: KnexCompanyRepository,
        private readonly createCompanyUseCase: CreateCompanyUseCase,
    ) { }

    async execute(params: { userId: number; company: Company }) {
        const schema = z.object({
            userId: z.number({
                required_error: ErrorMessages.USER_ID_REQUIRED,
                invalid_type_error: ErrorMessages.USER_ID_REQUIRED,
            })
                .min(1, ErrorMessages.USER_ID_REQUIRED),
        });

        const result = schema.safeParse({ userId: params.userId });
        if (!result.success) {
            throw new Error(result.error.issues[0].message);
        }

        const user = await this.userRepository.getUserById(result.data.userId);
        if (!user) {
            throw new Error(ErrorMessages.USER_NOT_FOUND);
        }

        if (user.company_id && user.company_id > 0) {
            throw new Error(ErrorMessages.USER_COMPANY_ALREADY_SET);
        }

        try {
            await this.createCompanyUseCase.execute(params.company);
        } catch (error: any) {
            // If the company was already created previously but the user was not linked,
            // allow linking it now (recovery path).
            if (error?.message !== ErrorMessages.COMPANY_ALREADY_EXISTS) {
                throw error;
            }
        }

        const createdCompany = await this.companyRepository.getByEmail(params.company.email);
        if (!createdCompany?.id) {
            throw new Error(ErrorMessages.COMPANY_NOT_FOUND);
        }

        await this.userRepository.updateCompanyId(result.data.userId, createdCompany.id);

        return createdCompany;
    }
}
