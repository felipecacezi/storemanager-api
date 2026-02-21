import type { KnexServiceOrderRepository } from "../../../infra/adapters/knex/service-order-repository.js";
import type { KnexClientRepository } from "../../../infra/adapters/knex/client-repository.js";
import type { KnexServiceRepository } from "../../../infra/adapters/knex/service-repository.js";
import type { KnexProductRepository } from "../../../infra/adapters/knex/product-repository.js";
import type { ServiceOrder } from "../../domain/entities/ServiceOrder.js";
import { ErrorMessages } from "../../domain/erros/error-mesages.js";
import { z } from "zod";

export class CreateServiceOrderUseCase {
    constructor(
        private serviceOrderRepository: KnexServiceOrderRepository,
        private clientRepository: KnexClientRepository,
        private serviceRepository: KnexServiceRepository,
        private productRepository: KnexProductRepository,
    ) { }

    async execute(serviceOrder: ServiceOrder) {
        const schema = z.object({
            client_id: z.number({
                message: ErrorMessages.SERVICE_ORDER_CLIENT_ID_REQUIRED,
                invalid_type_error: ErrorMessages.SERVICE_ORDER_CLIENT_ID_REQUIRED,
            }),
            description: z.string({ message: ErrorMessages.SERVICE_ORDER_DESCRIPTION_REQUIRED })
                .min(1, ErrorMessages.SERVICE_ORDER_DESCRIPTION_REQUIRED),
            service_id: z.number({
                message: ErrorMessages.SERVICE_ORDER_SERVICE_ID_REQUIRED,
                invalid_type_error: ErrorMessages.SERVICE_ORDER_SERVICE_ID_REQUIRED,
            }),
            product_id: z.number({
                message: ErrorMessages.SERVICE_ORDER_PRODUCT_ID_REQUIRED,
                invalid_type_error: ErrorMessages.SERVICE_ORDER_PRODUCT_ID_REQUIRED,
            }),
            service_status: z.string({
                required_error: ErrorMessages.SERVICE_ORDER_STATUS_REQUIRED,
                invalid_type_error: ErrorMessages.SERVICE_ORDER_INVALID_STATUS,
            }).min(1, ErrorMessages.SERVICE_ORDER_STATUS_REQUIRED)
                .refine((value) => ['pendente', 'em_andamento', 'concluido', 'finalizado', 'cancelado'].includes(value), {
                    message: ErrorMessages.SERVICE_ORDER_INVALID_STATUS
                }),
        });

        const result = schema.safeParse(serviceOrder);
        if (!result.success) {
            throw new Error(result.error.issues[0].message);
        }

        const clientExists = await this.clientRepository.getById(result.data.client_id);
        if (!clientExists) {
            throw new Error(ErrorMessages.CLIENT_NOT_FOUND);
        }

        const serviceExists = await this.serviceRepository.getById(result.data.service_id);
        if (!serviceExists) {
            throw new Error(ErrorMessages.SERVICE_NOT_FOUND);
        }

        const productExists = await this.productRepository.getById(result.data.product_id);
        if (!productExists) {
            throw new Error(ErrorMessages.PRODUCT_NOT_FOUND);
        }

        return await this.serviceOrderRepository.create(serviceOrder);
    }
}
