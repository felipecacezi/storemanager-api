import { KnexUserRepository } from "../../../infra/adapters/knex/user-repository.js"
import type { UserUpdate } from "../../domain/entities/User.js";
import { ErrorMessages } from "../../domain/erros/error-mesages.js";
import { z } from "zod";
import type { PasswordHasherRepository } from "../../../infra/adapters/bcrypt/password-hasher-repository.js";

export class UpdateUserUseCase {
    constructor(
        private userRepository: KnexUserRepository,
        private passwordHasherRepository: PasswordHasherRepository
    ) { }

    async execute(user: UserUpdate) {
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

        const hashedPassword = await this.passwordHasherRepository.hash(user.password ?? '');
        const userUpdate: UserUpdate = {
            id: user.id,
            name: user.name,
            email: user.email,
            password: hashedPassword,
            token: user.token
        };

        return await this.userRepository.update(userUpdate);
    }
}