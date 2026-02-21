import type { FastifyRequest, FastifyReply } from "fastify";
import type { CreateServiceUseCase } from "../../../core/application/use-cases/create-service.js";
import type { UpdateServiceUseCase } from "../../../core/application/use-cases/update-service.js";
import type { DeleteServiceUseCase } from "../../../core/application/use-cases/delete-service.js";
import type { GetAllServicesUseCase } from "../../../core/application/use-cases/get-all-services.js";

export class ServiceController {
    constructor(
        private readonly createServiceUseCase: CreateServiceUseCase,
        private readonly updateServiceUseCase: UpdateServiceUseCase,
        private readonly deleteServiceUseCase: DeleteServiceUseCase,
        private readonly getAllServicesUseCase: GetAllServicesUseCase,
    ) { }

    async create(request: FastifyRequest, reply: FastifyReply) {
        const { name, description, service_price } = request.body as any;
        await this.createServiceUseCase.execute({ name, description, service_price });
        return reply.status(201).send({ success: true, message: "Serviço criado com sucesso!" });
    }

    async update(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as any;
        const data = request.body as any;
        await this.updateServiceUseCase.execute({ id: Number(id), ...data });
        return reply.status(200).send({ success: true, message: "Serviço atualizado com sucesso!" });
    }

    async delete(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as any;
        await this.deleteServiceUseCase.execute({ id: Number(id) });
        return reply.status(200).send({ success: true, message: "Serviço removido com sucesso!" });
    }

    async getAll(request: FastifyRequest, reply: FastifyReply) {
        const { page, limit } = request.query as any;
        const services = await this.getAllServicesUseCase.execute({ page: Number(page), limit: Number(limit) });
        return reply.status(200).send({ success: true, data: services });
    }
}
