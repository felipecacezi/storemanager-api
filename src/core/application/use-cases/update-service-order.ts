import type { KnexServiceOrderRepository } from "../../../infra/adapters/knex/service-order-repository.js";
import type { ServiceOrderUpdate } from "../../domain/entities/ServiceOrder.js";
import { ErrorMessages } from "../../domain/erros/error-mesages.js";
import { z } from "zod";

export class UpdateServiceOrderUseCase {
    constructor(
        private serviceOrderRepository: KnexServiceOrderRepository
    ) { }

    async execute(serviceOrder: ServiceOrderUpdate) {
        const schema = z.object({
            id: z.number({
                message: ErrorMessages.SERVICE_ORDER_ID_REQUIRED,
                invalid_type_error: ErrorMessages.SERVICE_ORDER_ID_REQUIRED
            }),
            service_status: z.string({
                invalid_type_error: ErrorMessages.SERVICE_ORDER_INVALID_STATUS,
            }).refine((value) => ['pendente', 'em_andamento', 'concluido', 'finalizado', 'cancelado'].includes(value), {
                message: ErrorMessages.SERVICE_ORDER_INVALID_STATUS
            }).optional(),
        });

        const result = schema.safeParse(serviceOrder);
        if (!result.success) {
            throw new Error(result.error.issues[0].message);
        }

        const serviceOrderExists = await this.serviceOrderRepository.getById(result.data.id);
        if (!serviceOrderExists) {
            throw new Error(ErrorMessages.SERVICE_ORDER_NOT_FOUND);
        }

        return await this.serviceOrderRepository.update(serviceOrder);
    }
}
