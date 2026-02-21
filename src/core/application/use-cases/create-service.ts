import type { KnexServiceRepository } from "../../../infra/adapters/knex/service-repository.js";
import type { Service } from "../../domain/entities/Service.js";
import { ErrorMessages } from "../../domain/erros/error-mesages.js";
import { z } from "zod";

export class CreateServiceUseCase {
    constructor(
        private serviceRepository: KnexServiceRepository
    ) { }

    async execute(service: Service) {
        const schema = z.object({
            name: z.string({ message: ErrorMessages.SERVICE_NAME_REQUIRED })
                .min(1, ErrorMessages.SERVICE_NAME_REQUIRED),
            service_price: z.number({
                message: ErrorMessages.SERVICE_PRICE_REQUIRED,
                invalid_type_error: ErrorMessages.SERVICE_PRICE_REQUIRED,
            }).int(ErrorMessages.SERVICE_PRICE_REQUIRED),
        });

        const result = schema.safeParse(service);
        if (!result.success) {
            throw new Error(result.error.issues[0].message);
        }

        const serviceExists = await this.serviceRepository.getByName(result.data.name);
        if (serviceExists) {
            throw new Error(ErrorMessages.SERVICE_ALREADY_EXISTS);
        }

        return await this.serviceRepository.create(service);
    }
}
