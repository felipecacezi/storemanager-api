import type { FastifyInstance } from "fastify";
import { CompanyController } from "../controllers/company.controller.js";
import { KnexCompanyRepository } from "../../adapters/knex/company-repository.js";
import { CreateCompanyUseCase } from "../../../core/application/use-cases/create-company.js";
import { UpdateCompanyUseCase } from "../../../core/application/use-cases/update-company.js";
import { DeleteCompanyUseCase } from "../../../core/application/use-cases/delete-company.js";
import { GetAllCompaniesUseCase } from "../../../core/application/use-cases/get-all-companies.js";
import { authMiddleware } from "../middleware/auth-middleware.js";
import { companyMiddleware } from "../middleware/company-middleware.js";

export async function configurationsRoute(app: FastifyInstance) {
    const companyRepository = new KnexCompanyRepository(app.knex);

    const createCompanyUseCase = new CreateCompanyUseCase(companyRepository);
    const updateCompanyUseCase = new UpdateCompanyUseCase(companyRepository);
    const deleteCompanyUseCase = new DeleteCompanyUseCase(companyRepository);
    const getAllCompaniesUseCase = new GetAllCompaniesUseCase(companyRepository);

    const companyController = new CompanyController(
        createCompanyUseCase,
        updateCompanyUseCase,
        deleteCompanyUseCase,
        getAllCompaniesUseCase
    );

    app.addHook('onRequest', authMiddleware);
    app.addHook('onRequest', companyMiddleware);

    app.post('/companies', async (request, reply) => {
        return await companyController.create(request, reply);
    });

    app.put('/companies/:id', async (request, reply) => {
        return await companyController.update(request, reply);
    });

    app.delete('/companies/:id', async (request, reply) => {
        return await companyController.delete(request, reply);
    });

    app.get('/companies', async (request, reply) => {
        return await companyController.getAll(request, reply);
    });
}