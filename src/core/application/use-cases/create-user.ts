import { KnexUserRepository } from "../../../infra/adapters/knex/user-repository.js"
import type { User } from "../../domain/entities/User.js";

export class CreateUserUseCase {
    constructor(private userRepository: KnexUserRepository) { }

    async execute(user: User) {
        return await this.userRepository.create(user);
    }
}