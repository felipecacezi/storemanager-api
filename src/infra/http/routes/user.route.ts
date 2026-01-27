import type { FastifyInstance } from "fastify";
import { UserController } from "../controllers/user.controller.js";
import { CreateUserUseCase } from "../../../core/application/use-cases/create-user.js";
import { KnexUserRepository } from "../../adapters/knex/user-repository.js";


export async function userRoute(app: FastifyInstance) {
    const userRepository = new KnexUserRepository(app.knex);
    const createUserUseCase = new CreateUserUseCase(userRepository);
    const userController = new UserController(createUserUseCase);
    app.post('/user', async (request, reply) => {
        return await userController.create(request, reply);
    });
}