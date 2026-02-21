import type { FastifyInstance } from "fastify";
import { ClientController } from "../controllers/client.controller.js";
import { KnexClientRepository } from "../../adapters/knex/client-repository.js";
import { CreateClientUseCase } from "../../../core/application/use-cases/create-client.js";
import { UpdateClientUseCase } from "../../../core/application/use-cases/update-client.js";
import { DeleteClientUseCase } from "../../../core/application/use-cases/delete-client.js";
import { GetAllClientsUseCase } from "../../../core/application/use-cases/get-all-clients.js";
import { authMiddleware } from "../middleware/auth-middleware.js";

export async function clientRoute(app: FastifyInstance) {
    const clientRepository = new KnexClientRepository(app.knex);

    const createClientUseCase = new CreateClientUseCase(clientRepository);
    const updateClientUseCase = new UpdateClientUseCase(clientRepository);
    const deleteClientUseCase = new DeleteClientUseCase(clientRepository);
    const getAllClientsUseCase = new GetAllClientsUseCase(clientRepository);

    const clientController = new ClientController(
        createClientUseCase,
        updateClientUseCase,
        deleteClientUseCase,
        getAllClientsUseCase
    );

    app.addHook('onRequest', authMiddleware);

    app.post('/clients', async (request, reply) => {
        return await clientController.create(request, reply);
    });

    app.put('/clients/:id', async (request, reply) => {
        return await clientController.update(request, reply);
    });

    app.delete('/clients/:id', async (request, reply) => {
        return await clientController.delete(request, reply);
    });

    app.get('/clients', async (request, reply) => {
        return await clientController.getAll(request, reply);
    });
}
