import type { FastifyRequest, FastifyReply } from "fastify";
import type { CreateServiceOrderUseCase } from "../../../core/application/use-cases/create-service-order.js";
import type { UpdateServiceOrderUseCase } from "../../../core/application/use-cases/update-service-order.js";
import type { DeleteServiceOrderUseCase } from "../../../core/application/use-cases/delete-service-order.js";
import type { GetAllServiceOrdersUseCase } from "../../../core/application/use-cases/get-all-service-orders.js";

export class ServiceOrderController {
    constructor(
        private readonly createServiceOrderUseCase: CreateServiceOrderUseCase,
        private readonly updateServiceOrderUseCase: UpdateServiceOrderUseCase,
        private readonly deleteServiceOrderUseCase: DeleteServiceOrderUseCase,
        private readonly getAllServiceOrdersUseCase: GetAllServiceOrdersUseCase,
    ) { }

    async create(request: FastifyRequest, reply: FastifyReply) {
        const { client_id, description, service_id, product_id, service_status } = request.body as any;
        await this.createServiceOrderUseCase.execute({ client_id, description, service_id, product_id, service_status });
        return reply.status(201).send({ success: true, message: "Ordem de serviço criada com sucesso!" });
    }

    async update(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as any;
        const data = request.body as any;
        await this.updateServiceOrderUseCase.execute({ id: Number(id), ...data });
        return reply.status(200).send({ success: true, message: "Ordem de serviço atualizada com sucesso!" });
    }

    async delete(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as any;
        await this.deleteServiceOrderUseCase.execute({ id: Number(id) });
        return reply.status(200).send({ success: true, message: "Ordem de serviço removida com sucesso!" });
    }

    async getAll(request: FastifyRequest, reply: FastifyReply) {
        const { page, limit } = request.query as any;
        const orders = await this.getAllServiceOrdersUseCase.execute({ page: Number(page), limit: Number(limit) });
        return reply.status(200).send({ success: true, data: orders });
    }
}
