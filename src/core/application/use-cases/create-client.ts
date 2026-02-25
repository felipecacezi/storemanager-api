import type { KnexClientRepository } from "../../../infra/adapters/knex/client-repository.js";
import type { Client } from "../../domain/entities/Client.js";
import { ErrorMessages } from "../../domain/erros/error-mesages.js";
import { z } from "zod";

export class CreateClientUseCase {
    constructor(
        private clientRepository: KnexClientRepository
    ) { }

    async execute(client: Client) {
        const schema = z.object({
            name: z.string({ message: ErrorMessages.CLIENT_NAME_REQUIRED })
                .min(1, ErrorMessages.CLIENT_NAME_REQUIRED),

            email: z.string({ message: ErrorMessages.CLIENT_EMAIL_REQUIRED })
                .min(1, ErrorMessages.CLIENT_EMAIL_REQUIRED)
                .email(ErrorMessages.CLIENT_EMAIL_INVALID),

            document: z.string({ message: ErrorMessages.CLIENT_DOCUMENT_REQUIRED })
                .min(1, ErrorMessages.CLIENT_DOCUMENT_REQUIRED),

            phone: z.string({ message: ErrorMessages.CLIENT_PHONE_REQUIRED })
                .min(1, ErrorMessages.CLIENT_PHONE_REQUIRED),
        });

        const result = schema.safeParse(client);
        if (!result.success) {
            throw new Error(result.error.issues[0].message);
        }

        const clientExists = await this.clientRepository.getByEmail(result.data.email, client.company_id);
        if (clientExists) {
            throw new Error(ErrorMessages.CLIENT_ALREADY_EXISTS);
        }

        return await this.clientRepository.create(client);
    }
}
