import { KnexUserRepository } from "../../../infra/adapters/knex/user-repository.js"
import type { User } from "../../domain/entities/User.js";

export class CreateUserUseCase {
    constructor(private userRepository: KnexUserRepository) { }

    async execute(data: any) {

        const user: User = {
            id: 1,
            name: 'fernando',
            email: 'fernando@fernando.com',
            password: '123456'
        };

        return await this.userRepository.create(user);
    }
}