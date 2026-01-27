import type { FastifyRequest, FastifyReply } from "fastify";
import type { CreateUserUseCase } from "../../../core/application/use-cases/create-user.js";

export class UserController {
    constructor(private createUserUseCase: CreateUserUseCase) { }

    async create(request: FastifyRequest, reply: FastifyReply) {
        const { name, email, password } = request.body as any;
        await this.createUserUseCase.execute({ name, email, password });
        return reply.status(201).send();
    }
}