import { KnexUserRepository } from "../../../infra/adapters/knex/user-repository.js"
import type { User } from "../../domain/entities/User.js";
import { ErrorMessages } from "../../domain/erros/error-mesages.js";
import { z } from "zod";

export class UpdateUserUseCase {
    constructor(private userRepository: KnexUserRepository) { }

    async execute(user: User) {
        const schema = z.object({
            id: z.number({
                message: ErrorMessages.USER_ID_REQUIRED,
                invalid_type_error: ErrorMessages.USER_ID_REQUIRED
            })
        });

        let result = schema.safeParse(user);
        if (!result.success) {
            throw new Error(result.error.issues[0].message);
        }

        const userExists = await this.userRepository.getUserById(result.data.id);
        if (!userExists) {
            throw new Error(ErrorMessages.USER_NOT_FOUND);
        }

        return await this.userRepository.update(result.data);
    }
}