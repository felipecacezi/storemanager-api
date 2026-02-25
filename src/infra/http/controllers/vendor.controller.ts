import type { FastifyRequest, FastifyReply } from "fastify";
import type { CreateVendorUseCase } from "../../../core/application/use-cases/create-vendor.js";
import type { UpdateVendorUseCase } from "../../../core/application/use-cases/update-vendor.js";
import type { DeleteVendorUseCase } from "../../../core/application/use-cases/delete-vendor.js";
import type { GetAllVendorsUseCase } from "../../../core/application/use-cases/get-all-vendors.js";

export class VendorController {
    constructor(
        private readonly createVendorUseCase: CreateVendorUseCase,
        private readonly updateVendorUseCase: UpdateVendorUseCase,
        private readonly deleteVendorUseCase: DeleteVendorUseCase,
        private readonly getAllVendorsUseCase: GetAllVendorsUseCase,
    ) { }

    async create(request: FastifyRequest, reply: FastifyReply) {
        const company_id = Number(request.headers['x-company-id']);
        const { name, email, document, phone, is_whatsapp, country, address, number, city, neighborhood, state, zipcode, complement } = request.body as any;
        await this.createVendorUseCase.execute({ company_id, name, email, document, phone, is_whatsapp, country, address, number, city, neighborhood, state, zipcode, complement });
        return reply.status(201).send({ success: true, message: "Fornecedor criado com sucesso!" });
    }

    async update(request: FastifyRequest, reply: FastifyReply) {
        const company_id = Number(request.headers['x-company-id']);
        const { id } = request.params as any;
        const data = request.body as any;
        await this.updateVendorUseCase.execute({ id: Number(id), company_id, ...data });
        return reply.status(200).send({ success: true, message: "Fornecedor atualizado com sucesso!" });
    }

    async delete(request: FastifyRequest, reply: FastifyReply) {
        const company_id = Number(request.headers['x-company-id']);
        const { id } = request.params as any;
        await this.deleteVendorUseCase.execute({ id: Number(id), company_id });
        return reply.status(200).send({ success: true, message: "Fornecedor removido com sucesso!" });
    }

    async getAll(request: FastifyRequest, reply: FastifyReply) {
        const company_id = Number(request.headers['x-company-id']);
        const { page, limit } = request.query as any;
        const vendors = await this.getAllVendorsUseCase.execute({ page: Number(page), limit: Number(limit), company_id });
        return reply.status(200).send({ success: true, data: vendors });
    }
}
