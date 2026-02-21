import type { KnexServiceRepository } from "../../../infra/adapters/knex/service-repository.js";
import { ErrorMessages } from "../../domain/erros/error-mesages.js";
import { z } from "zod";

export class GetAllServicesUseCase {
    constructor(
        private serviceRepository: KnexServiceRepository
    ) { }

    async execute(params: { page: number, limit: number }) {
        const schema = z.object({
            page: z.number({
                required_error: ErrorMessages.SERVICE_PAGE_REQUIRED,
                invalid_type_error: ErrorMessages.SERVICE_PAGE_INVALID,
            })
                .min(1, ErrorMessages.SERVICE_PAGE_REQUIRED)
                .max(50, ErrorMessages.SERVICE_PAGE_MAX),
            limit: z.number({
                required_error: ErrorMessages.SERVICE_LIMIT_REQUIRED,
                invalid_type_error: ErrorMessages.SERVICE_LIMIT_INVALID,
            })
                .min(1, ErrorMessages.SERVICE_LIMIT_REQUIRED)
                .max(100, ErrorMessages.SERVICE_LIMIT_MAX),
        });

        const result = schema.safeParse(params);
        if (!result.success) {
            throw new Error(result.error.issues[0].message);
        }

        const { page, limit } = result.data;
        const services = await this.serviceRepository.getAll(page, limit);
        return services;
    }
}
