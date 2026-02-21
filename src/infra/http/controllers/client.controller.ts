import type { FastifyRequest, FastifyReply } from "fastify";
import type { CreateClientUseCase } from "../../../core/application/use-cases/create-client.js";
import type { UpdateClientUseCase } from "../../../core/application/use-cases/update-client.js";
import type { DeleteClientUseCase } from "../../../core/application/use-cases/delete-client.js";
import type { GetAllClientsUseCase } from "../../../core/application/use-cases/get-all-clients.js";

export class ClientController {
    constructor(
        private readonly createClientUseCase: CreateClientUseCase,
        private readonly updateClientUseCase: UpdateClientUseCase,
        private readonly deleteClientUseCase: DeleteClientUseCase,
        private readonly getAllClientsUseCase: GetAllClientsUseCase,
    ) { }

    async create(request: FastifyRequest, reply: FastifyReply) {
        const { name, email, document, phone, is_whatsapp, country, address, number, city, neighborhood, state, zipcode, complement } = request.body as any;
        await this.createClientUseCase.execute({ name, email, document, phone, is_whatsapp, country, address, number, city, neighborhood, state, zipcode, complement });
        return reply.status(201).send({ success: true, message: "Cliente criado com sucesso!" });
    }

    async update(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as any;
        const data = request.body as any;
        await this.updateClientUseCase.execute({ id: Number(id), ...data });
        return reply.status(200).send({ success: true, message: "Cliente atualizado com sucesso!" });
    }

    async delete(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as any;
        await this.deleteClientUseCase.execute({ id: Number(id) });
        return reply.status(200).send({ success: true, message: "Cliente removido com sucesso!" });
    }

    async getAll(request: FastifyRequest, reply: FastifyReply) {
        const { page, limit } = request.query as any;
        const clients = await this.getAllClientsUseCase.execute({ page: Number(page), limit: Number(limit) });
        return reply.status(200).send({ success: true, data: clients });
    }
}
