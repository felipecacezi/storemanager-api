import type { FastifyInstance } from "fastify";
import { UserController } from "../controllers/user.controller.js";
import { CreateUserUseCase } from "../../../core/application/use-cases/create-user.js";
import { AuthenticateUserUseCase } from "../../../core/application/use-cases/authenticate-user.js";
import { KnexUserRepository } from "../../adapters/knex/user-repository.js";
import { PasswordHasherRepository } from "../../../infra/adapters/bcrypt/password-hasher-repository.js";
import { UpdateUserUseCase } from "../../../core/application/use-cases/update-user.js"
import { CreateJwtTokenRepository } from "../../../infra/adapters/jwt/token-utilities-adapter.js";


export async function userRoute(app: FastifyInstance) {
    const passwordHasherRepository = new PasswordHasherRepository();
    const userRepository = new KnexUserRepository(
        app.knex,
        passwordHasherRepository
    );
    const createUserUseCase = new CreateUserUseCase(userRepository);
    const updateUserUseCase = new UpdateUserUseCase(userRepository);
    const createJwtTokenRepository = new CreateJwtTokenRepository(app);
    const authenticateUserUseCase = new AuthenticateUserUseCase(
        userRepository,
        passwordHasherRepository,
        updateUserUseCase,
        createJwtTokenRepository
    );

    const userController = new UserController(
        createUserUseCase,
        authenticateUserUseCase
    );

    app.post('/user', async (request, reply) => {
        return await userController.create(request, reply);
    });

    app.post('/auth', async (request, reply) => {
        return await userController.authenticate(request, reply);
    });
}