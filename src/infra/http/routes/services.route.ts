import type { FastifyInstance } from "fastify";
import { ServiceController } from "../controllers/service.controller.js";
import { KnexServiceRepository } from "../../adapters/knex/service-repository.js";
import { CreateServiceUseCase } from "../../../core/application/use-cases/create-service.js";
import { UpdateServiceUseCase } from "../../../core/application/use-cases/update-service.js";
import { DeleteServiceUseCase } from "../../../core/application/use-cases/delete-service.js";
import { GetAllServicesUseCase } from "../../../core/application/use-cases/get-all-services.js";
import { authMiddleware } from "../middleware/auth-middleware.js";

export async function serviceRoute(app: FastifyInstance) {
    const serviceRepository = new KnexServiceRepository(app.knex);

    const createServiceUseCase = new CreateServiceUseCase(serviceRepository);
    const updateServiceUseCase = new UpdateServiceUseCase(serviceRepository);
    const deleteServiceUseCase = new DeleteServiceUseCase(serviceRepository);
    const getAllServicesUseCase = new GetAllServicesUseCase(serviceRepository);

    const serviceController = new ServiceController(
        createServiceUseCase,
        updateServiceUseCase,
        deleteServiceUseCase,
        getAllServicesUseCase
    );

    app.addHook('onRequest', authMiddleware);

    app.post('/services', async (request, reply) => {
        return await serviceController.create(request, reply);
    });

    app.put('/services/:id', async (request, reply) => {
        return await serviceController.update(request, reply);
    });

    app.delete('/services/:id', async (request, reply) => {
        return await serviceController.delete(request, reply);
    });

    app.get('/services', async (request, reply) => {
        return await serviceController.getAll(request, reply);
    });
}