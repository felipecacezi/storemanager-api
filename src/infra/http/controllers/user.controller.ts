import type { FastifyRequest, FastifyReply } from "fastify";
import type { CreateUserUseCase } from "../../../core/application/use-cases/create-user.js";
import type { AuthenticateUserUseCase } from "../../../core/application/use-cases/authenticate-user.js";

export class UserController {
    constructor(
        private createUserUseCase: CreateUserUseCase,
        private authenticateUserUseCase: AuthenticateUserUseCase
    ) { }

    async create(request: FastifyRequest, reply: FastifyReply) {
        const { name, email, password } = request.body as any;
        await this.createUserUseCase.execute({ name, email, password });
        return reply.status(201).send({ success: true, message: "Usuário criado com sucesso!" });
    }

    async authenticate(request: FastifyRequest, reply: FastifyReply) {
        const { email, password } = request.body as any;
        const authenticatedUser = await this.authenticateUserUseCase.execute(email, password);
        return reply.status(200).send({ success: true, message: `Usuário "${authenticatedUser.name}" autenticado com sucesso!`, token: authenticatedUser.token });
    }
}