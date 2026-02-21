import type { FastifyInstance } from "fastify";
import { ServiceOrderController } from "../controllers/service-order.controller.js";
import { KnexServiceOrderRepository } from "../../adapters/knex/service-order-repository.js";
import { KnexClientRepository } from "../../adapters/knex/client-repository.js";
import { KnexServiceRepository } from "../../adapters/knex/service-repository.js";
import { KnexProductRepository } from "../../adapters/knex/product-repository.js";
import { CreateServiceOrderUseCase } from "../../../core/application/use-cases/create-service-order.js";
import { UpdateServiceOrderUseCase } from "../../../core/application/use-cases/update-service-order.js";
import { DeleteServiceOrderUseCase } from "../../../core/application/use-cases/delete-service-order.js";
import { GetAllServiceOrdersUseCase } from "../../../core/application/use-cases/get-all-service-orders.js";
import { authMiddleware } from "../middleware/auth-middleware.js";

export async function osRoute(app: FastifyInstance) {
    const serviceOrderRepository = new KnexServiceOrderRepository(app.knex);
    const clientRepository = new KnexClientRepository(app.knex);
    const serviceRepository = new KnexServiceRepository(app.knex);
    const productRepository = new KnexProductRepository(app.knex);

    const createServiceOrderUseCase = new CreateServiceOrderUseCase(
        serviceOrderRepository,
        clientRepository,
        serviceRepository,
        productRepository
    );
    const updateServiceOrderUseCase = new UpdateServiceOrderUseCase(serviceOrderRepository);
    const deleteServiceOrderUseCase = new DeleteServiceOrderUseCase(serviceOrderRepository);
    const getAllServiceOrdersUseCase = new GetAllServiceOrdersUseCase(serviceOrderRepository);

    const controller = new ServiceOrderController(
        createServiceOrderUseCase,
        updateServiceOrderUseCase,
        deleteServiceOrderUseCase,
        getAllServiceOrdersUseCase
    );

    app.addHook('onRequest', authMiddleware);

    app.post('/service-orders', async (request, reply) => {
        return await controller.create(request, reply);
    });

    app.put('/service-orders/:id', async (request, reply) => {
        return await controller.update(request, reply);
    });

    app.delete('/service-orders/:id', async (request, reply) => {
        return await controller.delete(request, reply);
    });

    app.get('/service-orders', async (request, reply) => {
        return await controller.getAll(request, reply);
    });
}