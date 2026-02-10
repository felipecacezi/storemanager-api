import { KnexUserRepository } from "../../../infra/adapters/knex/user-repository.js"
import type { User } from "../../domain/entities/User.js";
import { ErrorMessages } from "../../domain/erros/error-mesages.js";

export class UpdateUserUseCase {
    constructor(private userRepository: KnexUserRepository) { }

    async execute(user: User) {
        if (!user) {
            throw new Error();
        }
        return await this.userRepository.update(user);
    }
}