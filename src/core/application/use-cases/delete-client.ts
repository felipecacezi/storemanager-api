import type { KnexClientRepository } from "../../../infra/adapters/knex/client-repository.js";
import type { ClientUpdate } from "../../domain/entities/Client.js";
import { ErrorMessages } from "../../domain/erros/error-mesages.js";
import { z } from "zod";


export class DeleteClientUseCase {
    constructor(
        private clientRepository: KnexClientRepository,
    ) { }

    async execute(client: ClientUpdate) {
        const schema = z.object({
            id: z.number({
                message: ErrorMessages.CLIENT_ID_REQUIRED,
                invalid_type_error: ErrorMessages.CLIENT_ID_REQUIRED
            })
        });

        const result = schema.safeParse(client);
        if (!result.success) {
            throw new Error(result.error.issues[0].message);
        }

        const clientExists = await this.clientRepository.getById(result.data.id);
        if (!clientExists) {
            throw new Error(ErrorMessages.CLIENT_NOT_FOUND);
        }

        return await this.clientRepository.update({ id: result.data.id, status: false });
    }
}