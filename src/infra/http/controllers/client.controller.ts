import type { FastifyRequest, FastifyReply } from "fastify";
import type { CreateClientUseCase } from "../../../core/application/use-cases/create-client.js";
import type { UpdateClientUseCase } from "../../../core/application/use-cases/update-client.js";
import type { DeleteClientUseCase } from "../../../core/application/use-cases/delete-client.js";
import type { GetAllClientsUseCase } from "../../../core/application/use-cases/get-all-clients.js";
import type { GetClientByIdUseCase } from "../../../core/application/use-cases/get-client-by-id.js";

export class ClientController {
    constructor(
        private readonly createClientUseCase: CreateClientUseCase,
        private readonly updateClientUseCase: UpdateClientUseCase,
        private readonly deleteClientUseCase: DeleteClientUseCase,
        private readonly getAllClientsUseCase: GetAllClientsUseCase,
        private readonly getClientByIdUseCase: GetClientByIdUseCase,
    ) { }

    async create(request: FastifyRequest, reply: FastifyReply) {
        const company_id = Number(request.headers['x-company-id']);
        const { name, email, document, phone, is_whatsapp, country, address, number, city, neighborhood, state, zipcode, complement, status } = request.body as any;
        await this.createClientUseCase.execute({ company_id, name, email, document, phone, is_whatsapp, country, address, number, city, neighborhood, state, zipcode, complement, status });
        return reply.status(201).send({ success: true, message: "Cliente criado com sucesso!" });
    }

    async update(request: FastifyRequest, reply: FastifyReply) {
        const company_id = Number(request.headers['x-company-id']);
        const { id } = request.params as any;
        const data = request.body as any;

        console.log('data', data);
        await this.updateClientUseCase.execute({ id: Number(id), company_id, ...data });
        return reply.status(200).send({ success: true, message: "Cliente atualizado com sucesso!" });
    }

    async delete(request: FastifyRequest, reply: FastifyReply) {
        const company_id = Number(request.headers['x-company-id']);
        const { id } = request.params as any;
        await this.deleteClientUseCase.execute({ id: Number(id), company_id });
        return reply.status(200).send({ success: true, message: "Cliente removido com sucesso!" });
    }

    async getById(request: FastifyRequest, reply: FastifyReply) {
        const company_id = Number(request.headers['x-company-id']);
        const { id } = request.params as any;
        const client = await this.getClientByIdUseCase.execute({ id: Number(id), company_id });
        return reply.status(200).send({ success: true, data: client });
    }

    async getAll(request: FastifyRequest, reply: FastifyReply) {
        const company_id = Number(request.headers['x-company-id']);
        const { page, limit, search } = request.query as any;
        const clients = await this.getAllClientsUseCase.execute({
            page: Number(page),
            limit: Number(limit),
            company_id,
            search: typeof search === "string" ? search : undefined,
        });
        return reply.status(200).send({ success: true, data: clients });
    }
}
