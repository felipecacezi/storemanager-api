import type { KnexCompanyRepository } from "../../../infra/adapters/knex/company-repository.js";
import type { KnexUserRepository } from "../../../infra/adapters/knex/user-repository.js";
import type { Company } from "../../domain/entities/Company.js";
import { ErrorMessages } from "../../domain/erros/error-mesages.js";
import { z } from "zod";

export class GetCompanyForUserUseCase {
    constructor(
        private readonly userRepository: KnexUserRepository,
        private readonly companyRepository: KnexCompanyRepository
    ) { }

    async execute(params: { userId: number }): Promise<Company | null> {
        const schema = z.object({
            userId: z.number({
                required_error: ErrorMessages.USER_ID_REQUIRED,
                invalid_type_error: ErrorMessages.USER_ID_REQUIRED,
            })
                .min(1, ErrorMessages.USER_ID_REQUIRED),
        });

        const result = schema.safeParse(params);
        if (!result.success) {
            throw new Error(result.error.issues[0].message);
        }

        const user = await this.userRepository.getUserById(result.data.userId);
        if (!user) {
            throw new Error(ErrorMessages.USER_NOT_FOUND);
        }

        if (!user.company_id || user.company_id <= 0) {
            return null;
        }

        const company = await this.companyRepository.getById(user.company_id);
        if (!company || company.status === false) {
            return null;
        }

        return company;
    }
}
