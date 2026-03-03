import type { KnexUserRepository } from "../../../infra/adapters/knex/user-repository.js";
import type { KnexCompanyRepository } from "../../../infra/adapters/knex/company-repository.js";
import { ErrorMessages } from "../../domain/erros/error-mesages.js";
import { ErroCodes } from "../../domain/enums/error-codes.js";
import { z } from "zod";

type UserCompanyStatus = {
    hasCompany: boolean;
    companyId?: number;
};

export class GetUserCompanyStatusUseCase {
    constructor(
        private readonly userRepository: KnexUserRepository,
        private readonly companyRepository: KnexCompanyRepository
    ) { }

    async execute(params: { userId: number }): Promise<UserCompanyStatus> {
        const schema = z.object({
            userId: z.number({ required_error: ErrorMessages[ErroCodes.USER_ID_REQUIRED] })
                .min(1, ErrorMessages[ErroCodes.USER_ID_REQUIRED]),
        });

        const result = schema.safeParse(params);
        if (!result.success) {
            throw new Error(result.error.issues[0].message);
        }

        const { userId } = result.data;

        const user = await this.userRepository.getUserById(userId);
        if (!user) {
            throw new Error(ErrorMessages[ErroCodes.USER_NOT_FOUND]);
        }

        if (!user.company_id || user.company_id <= 0) {
            return { hasCompany: false };
        }

        const company = await this.companyRepository.getById(user.company_id);
        if (!company || company.status === false) {
            return { hasCompany: false };
        }

        return { hasCompany: true, companyId: company.id };
    }
}
