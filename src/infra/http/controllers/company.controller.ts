import type { FastifyRequest, FastifyReply } from "fastify";
import type { CreateCompanyForUserUseCase } from "../../../core/application/use-cases/create-company-for-user.js";
import type { GetCompanyForUserUseCase } from "../../../core/application/use-cases/get-company-for-user.js";
import type { UpdateCompanyUseCase } from "../../../core/application/use-cases/update-company.js";
import type { DeleteCompanyUseCase } from "../../../core/application/use-cases/delete-company.js";
import type { GetAllCompaniesUseCase } from "../../../core/application/use-cases/get-all-companies.js";
import jwt from "jsonwebtoken";

export class CompanyController {
    constructor(
        private readonly createCompanyForUserUseCase: CreateCompanyForUserUseCase,
        private readonly getCompanyForUserUseCase: GetCompanyForUserUseCase,
        private readonly updateCompanyUseCase: UpdateCompanyUseCase,
        private readonly deleteCompanyUseCase: DeleteCompanyUseCase,
        private readonly getAllCompaniesUseCase: GetAllCompaniesUseCase,
    ) { }

    async create(request: FastifyRequest, reply: FastifyReply) {
        const token = request.headers.authorization?.replace('Bearer ', '');
        const decoded: any = token ? jwt.decode(token) : null;
        const userId = Number(decoded?.id);

        const {
            name,
            document,
            email,
            phone,
            is_whatsapp,
            country,
            address,
            number,
            city,
            neighborhood,
            state,
            zipcode,
            complement,
            status,
        } = request.body as any;

        const company = await this.createCompanyForUserUseCase.execute({
            userId,
            company: {
                name,
                document,
                email,
                phone,
                is_whatsapp,
                country,
                address,
                number,
                city,
                neighborhood,
                state,
                zipcode,
                complement,
                status,
            }
        });

        return reply.status(201).send({ success: true, message: "Empresa criada com sucesso!", data: company });
    }

    async me(request: FastifyRequest, reply: FastifyReply) {
        const token = request.headers.authorization?.replace('Bearer ', '');
        const decoded: any = token ? jwt.decode(token) : null;
        const userId = Number(decoded?.id);

        const company = await this.getCompanyForUserUseCase.execute({ userId });

        return reply.status(200).send({ success: true, data: company });
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
