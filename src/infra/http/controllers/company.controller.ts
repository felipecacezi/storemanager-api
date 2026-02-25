import type { FastifyRequest, FastifyReply } from "fastify";
import type { CreateCompanyUseCase } from "../../../core/application/use-cases/create-company.js";
import type { UpdateCompanyUseCase } from "../../../core/application/use-cases/update-company.js";
import type { DeleteCompanyUseCase } from "../../../core/application/use-cases/delete-company.js";
import type { GetAllCompaniesUseCase } from "../../../core/application/use-cases/get-all-companies.js";

export class CompanyController {
    constructor(
        private readonly createCompanyUseCase: CreateCompanyUseCase,
        private readonly updateCompanyUseCase: UpdateCompanyUseCase,
        private readonly deleteCompanyUseCase: DeleteCompanyUseCase,
        private readonly getAllCompaniesUseCase: GetAllCompaniesUseCase,
    ) { }

    async create(request: FastifyRequest, reply: FastifyReply) {
        const { document, email, phone, country, address, number, city, neighborhood, state, zipcode, complement } = request.body as any;
        await this.createCompanyUseCase.execute({ document, email, phone, country, address, number, city, neighborhood, state, zipcode, complement });
        return reply.status(201).send({ success: true, message: "Empresa criada com sucesso!" });
    }

    async update(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as any;
        const data = request.body as any;
        await this.updateCompanyUseCase.execute({ id: Number(id), ...data });
        return reply.status(200).send({ success: true, message: "Empresa atualizada com sucesso!" });
    }

    async delete(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as any;
        await this.deleteCompanyUseCase.execute({ id: Number(id) });
        return reply.status(200).send({ success: true, message: "Empresa removida com sucesso!" });
    }

    async getAll(request: FastifyRequest, reply: FastifyReply) {
        const { page, limit } = request.query as any;
        const companies = await this.getAllCompaniesUseCase.execute({ page: Number(page), limit: Number(limit) });
        return reply.status(200).send({ success: true, data: companies });
    }
}
