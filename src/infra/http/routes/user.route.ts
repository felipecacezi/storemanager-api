import type { FastifyInstance } from "fastify";
import { UserController } from "../controllers/user.controller.js";
import { CreateUserUseCase } from "../../../core/application/use-cases/create-user.js";
import { AuthenticateUserUseCase } from "../../../core/application/use-cases/authenticate-user.js";
import { KnexUserRepository } from "../../adapters/knex/user-repository.js";
import { PasswordHasherRepository } from "../../../infra/adapters/bcrypt/password-hasher-repository.js";
import { UpdateUserUseCase } from "../../../core/application/use-cases/update-user.js"
import { CreateJwtTokenRepository } from "../../../infra/adapters/jwt/token-utilities-adapter.js";
import { ForgotPasswordUseCase } from "../../../core/application/use-cases/forgot-password.js";
import { SendMailUseCase } from "../../../core/application/use-cases/send-mail.js";
import { MailtrapEmailAdapter } from "../../adapters/email/mailtrap-email.adapter.js";
import { CryptoPasswordGenerator } from "../../utils/crypto-password-generator.adapter.js";
import { authMiddleware } from "../middleware/auth-middleware.js";
import { companyMiddleware } from "../middleware/company-middleware.js";
import { refreshToken } from "../middleware/renew-jwt-middleware.js";

export async function userRoute(app: FastifyInstance) {
    const passwordHasherRepository = new PasswordHasherRepository();
    const userRepository = new KnexUserRepository(
        app.knex
    );
    const createUserUseCase = new CreateUserUseCase(
        userRepository,
        passwordHasherRepository
    );
    const updateUserUseCase = new UpdateUserUseCase(
        userRepository,
        passwordHasherRepository
    );
    const createJwtTokenRepository = new CreateJwtTokenRepository(app);
    const authenticateUserUseCase = new AuthenticateUserUseCase(
        userRepository,
        passwordHasherRepository,
        updateUserUseCase,
        createJwtTokenRepository
    );

    const mailtrapEmailAdapter = new MailtrapEmailAdapter();
    const sendMailUseCase = new SendMailUseCase(mailtrapEmailAdapter);
    const cryptoPasswordGenerator = new CryptoPasswordGenerator();
    const forgotPasswordUseCase = new ForgotPasswordUseCase(
        userRepository,
        sendMailUseCase,
        cryptoPasswordGenerator,
        updateUserUseCase
    );
    const userController = new UserController(
        createUserUseCase,
        authenticateUserUseCase,
        forgotPasswordUseCase,
        updateUserUseCase
    );

    app.post('/user', async (request, reply) => {
        return await userController.create(request, reply);
    });

    app.post('/user/forgot-password', async (request, reply) => {
        return await userController.forgotPassword(request, reply);
    });

    app.post('/auth', async (request, reply) => {
        return await userController.authenticate(request, reply);
    });

    app.patch('/user', {
        onRequest: [authMiddleware, companyMiddleware],
        preHandler: [async (request, reply) => {
            await refreshToken(request, reply, {});
        }]
    }, async (request, reply) => {
        return await userController.update(request, reply);
    });

}