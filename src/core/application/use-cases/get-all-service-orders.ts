import type { KnexServiceOrderRepository } from "../../../infra/adapters/knex/service-order-repository.js";
import { ErrorMessages } from "../../domain/erros/error-mesages.js";
import { z } from "zod";

export class GetAllServiceOrdersUseCase {
    constructor(
        private serviceOrderRepository: KnexServiceOrderRepository
    ) { }

    async execute(params: { page: number, limit: number }) {
        const schema = z.object({
            page: z.number({
                required_error: ErrorMessages.SERVICE_ORDER_PAGE_REQUIRED,
                invalid_type_error: ErrorMessages.SERVICE_ORDER_PAGE_INVALID,
            })
                .min(1, ErrorMessages.SERVICE_ORDER_PAGE_REQUIRED)
                .max(50, ErrorMessages.SERVICE_ORDER_PAGE_MAX),
            limit: z.number({
                required_error: ErrorMessages.SERVICE_ORDER_LIMIT_REQUIRED,
                invalid_type_error: ErrorMessages.SERVICE_ORDER_LIMIT_INVALID,
            })
                .min(1, ErrorMessages.SERVICE_ORDER_LIMIT_REQUIRED)
                .max(100, ErrorMessages.SERVICE_ORDER_LIMIT_MAX),
        });

        const result = schema.safeParse(params);
        if (!result.success) {
            throw new Error(result.error.issues[0].message);
        }

        const { page, limit } = result.data;
        const serviceOrders = await this.serviceOrderRepository.getAll(page, limit);
        return serviceOrders;
    }
}
