import type { KnexClientRepository } from "../../../infra/adapters/knex/client-repository.js";
import { ErrorMessages } from "../../domain/erros/error-mesages.js";
import { z } from "zod";

export class GetAllClientsUseCase {
    constructor(
        private clientRepository: KnexClientRepository
    ) { }

    async execute(params: { page: number, limit: number, company_id: number }) {
        const schema = z.object({
            page: z.number({
                required_error: ErrorMessages.CLIENT_PAGE_REQUIRED,
                invalid_type_error: ErrorMessages.CLIENT_PAGE_INVALID,
            })
                .min(1, ErrorMessages.CLIENT_PAGE_REQUIRED)
                .max(50, ErrorMessages.CLIENT_PAGE_MAX),
            limit: z.number({
                required_error: ErrorMessages.CLIENT_LIMIT_REQUIRED,
                invalid_type_error: ErrorMessages.CLIENT_LIMIT_INVALID,
            })
                .min(1, ErrorMessages.CLIENT_LIMIT_REQUIRED)
                .max(100, ErrorMessages.CLIENT_LIMIT_MAX),
        });

        const result = schema.safeParse(params);
        if (!result.success) {
            throw new Error(result.error.issues[0].message);
        }

        const { page, limit } = result.data;
        const clients = await this.clientRepository.getAll(page, limit, params.company_id);

        return clients;
    }
}