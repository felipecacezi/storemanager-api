import { KnexUserRepository } from "../../../infra/adapters/knex/user-repository.js"
import type { User } from "../../domain/entities/User.js";
import { ErrorMessages } from "../../domain/erros/error-mesages.js";
import type { PasswordHasherRepository } from "../../../infra/adapters/bcrypt/password-hasher-repository.js";
import { z } from "zod";

export class CreateUserUseCase {
    constructor(
        private userRepository: KnexUserRepository,
        private passwordHasherRepository: PasswordHasherRepository
    ) { }

    async execute(user: User) {
        const schema = z.object({
            name: z.string({ message: ErrorMessages.USER_NAME_REQUIRED })
                .min(1, ErrorMessages.USER_NAME_REQUIRED),

            email: z.string({ message: ErrorMessages.USER_EMAIL_REQUIRED })
                .min(1, ErrorMessages.USER_EMAIL_REQUIRED)
                .email(ErrorMessages.USER_EMAIL_INVALID)
                .min(3, ErrorMessages.USER_EMAIL_INVALID),

            password: z.string({
                message: ErrorMessages.USER_PASSWORD_REQUIRED,
                invalid_type_error: ErrorMessages.USER_PASSWORD_REQUIRED
            })
                .min(1, ErrorMessages.USER_PASSWORD_REQUIRED)
                .min(6, ErrorMessages.USER_PASSWORD_MIN_LENGTH),
        })

        let result = schema.safeParse(user);
        if (!result.success) {
            throw new Error(result.error.issues[0].message);
        }

        const objUserFound = await this.userRepository.getUserByEmail(result.data.email);
        if (objUserFound) {
            throw new Error(ErrorMessages.USER_ALREADY_EXISTS);
        }

        const hashedPassword = await this.passwordHasherRepository.hash(result.data.password);
        result.data.password = hashedPassword;
        return await this.userRepository.create(result.data);
    }
}