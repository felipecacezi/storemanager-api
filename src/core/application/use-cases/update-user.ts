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

        if (user?.password) {
            const schema = z.object({
                id: z.number({
                    message: ErrorMessages.USER_ID_REQUIRED,
                    invalid_type_error: ErrorMessages.USER_ID_REQUIRED
                }),
                password: z.string({
                    message: ErrorMessages.PASSWORD_REQUIRED,
                    invalid_type_error: ErrorMessages.PASSWORD_REQUIRED
                }),
                confirm_password: z.string({
                    message: ErrorMessages.CONFIRM_PASSWORD_REQUIRED,
                    invalid_type_error: ErrorMessages.CONFIRM_PASSWORD_REQUIRED
                })
            });

            let result = schema.safeParse(user);
            if (!result.success) {
                throw new Error(result.error.issues[0].message);
            }

            if (result.data.password !== result.data.confirm_password) {
                throw new Error(ErrorMessages.PASSWORDS_DO_NOT_MATCH);
            }
        }

        const userUpdate: UserUpdate = {
            id: user.id,
            email: user.email,
            password: undefined,
            token: user.token
        };

        if (userUpdate.password) {
            userUpdate.password = await this.passwordHasherRepository.hash(userUpdate.password);
        }

        return await this.userRepository.update(userUpdate);
    }
}