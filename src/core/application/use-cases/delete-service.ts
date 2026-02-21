import type { KnexServiceRepository } from "../../../infra/adapters/knex/service-repository.js";
import type { ServiceUpdate } from "../../domain/entities/Service.js";
import { ErrorMessages } from "../../domain/erros/error-mesages.js";
import { z } from "zod";

export class DeleteServiceUseCase {
    constructor(
        private serviceRepository: KnexServiceRepository,
    ) { }

    async execute(service: ServiceUpdate) {
        const schema = z.object({
            id: z.number({
                message: ErrorMessages.SERVICE_ID_REQUIRED,
                invalid_type_error: ErrorMessages.SERVICE_ID_REQUIRED
            })
        });

        const result = schema.safeParse(service);
        if (!result.success) {
            throw new Error(result.error.issues[0].message);
        }

        const serviceExists = await this.serviceRepository.getById(result.data.id);
        if (!serviceExists) {
            throw new Error(ErrorMessages.SERVICE_NOT_FOUND);
        }

        return await this.serviceRepository.update({ id: result.data.id, status: false });
    }
}
