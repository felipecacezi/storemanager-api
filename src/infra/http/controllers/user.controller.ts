import type { FastifyRequest, FastifyReply } from "fastify";
import type { CreateUserUseCase } from "../../../core/application/use-cases/create-user.js";
import type { AuthenticateUserUseCase } from "../../../core/application/use-cases/authenticate-user.js";
import type { ForgotPasswordUseCase } from "../../../core/application/use-cases/forgot-password.js";
import type { UpdateUserUseCase } from "../../../core/application/use-cases/update-user.js";
import jwt from "jsonwebtoken";

export class UserController {
    constructor(
        private createUserUseCase: CreateUserUseCase,
        private authenticateUserUseCase: AuthenticateUserUseCase,
        private forgotPasswordUseCase: ForgotPasswordUseCase,
        private updateUserUseCase: UpdateUserUseCase
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

    async forgotPassword(request: FastifyRequest, reply: FastifyReply) {
        const { email } = request.body as any;
        await this.forgotPasswordUseCase.execute(email);
        return reply.status(200).send({ success: true, message: "Email enviado com sucesso!" });
    }

    async update(request: FastifyRequest, reply: FastifyReply) {
        const company_id = Number(request.headers['x-company-id']);
        const token = request.headers.authorization?.replace('Bearer ', '');
        const decoded: any = token ? jwt.decode(token) : null;
        const userId = Number(decoded?.id);
        const { email, password, confirm_password } = request.body as any;

        await this.updateUserUseCase.execute({
            id: userId,
            company_id,
            email,
            password,
            confirm_password
        });

        return reply.status(200).send({ success: true, message: "Usuário atualizado com sucesso!" });
    }
}