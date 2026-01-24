import type { FastifyInstance } from "fastify";
import { UserController } from "../controllers/user.controller.js";
import { CreateUserUseCase } from "../../../core/application/use-cases/create-user.js";
import { KnexUserRepository } from "../../adapters/knex/user-repository.js";


export async function testRoute(app: FastifyInstance) {
    // 1. Instanciar o Repositório (Injetando o driver de banco 'Knex')
    // O 'app.knex' vem do seu plugin registrado anteriormente
    const userRepository = new KnexUserRepository(app.knex);
    // 2. Instanciar o Caso de Uso (Injetando o Repositório)
    const createUserUseCase = new CreateUserUseCase(userRepository);
    // 3. Instanciar o Controller (Injetando o Caso de Uso)
    const userController = new UserController(createUserUseCase);
    // 4. Definir a Rota e chamar o método do Controller
    app.get('/test', async (request, reply) => {
        // Importante: Usamos uma arrow function ou .bind() para manter o contexto do 'this'
        return await userController.create(request, reply);
    });
}