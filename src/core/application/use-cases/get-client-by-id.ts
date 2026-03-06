import type { KnexClientRepository } from "../../../infra/adapters/knex/client-repository.js";
import { ErrorMessages } from "../../domain/erros/error-mesages.js";
import { z } from "zod";

export class GetClientByIdUseCase {
    constructor(
        private clientRepository: KnexClientRepository
    ) { }

    async execute(params: { id: number, company_id: number }) {
        const schema = z.object({
            id: z.number({
                message: ErrorMessages.CLIENT_ID_REQUIRED,
                invalid_type_error: ErrorMessages.CLIENT_ID_REQUIRED
            })
        });

        const result = schema.safeParse(params);
        if (!result.success) {
            throw new Error(result.error.issues[0].message);
        }

        const client = await this.clientRepository.getById(result.data.id, params.company_id);
        if (!client) {
            throw new Error(ErrorMessages.CLIENT_NOT_FOUND);
        }

        return client;
    }
}
