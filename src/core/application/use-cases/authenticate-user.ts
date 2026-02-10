import { KnexUserRepository } from "../../../infra/adapters/knex/user-repository.js"
import { PasswordHasherRepository } from "../../../infra/adapters/bcrypt/password-hasher-repository.js";
import { ErrorMessages } from "../../domain/erros/error-mesages.js";
import { UpdateUserUseCase } from "./update-user.js";
import { CreateJwtTokenRepository } from "../../../infra/adapters/jwt/token-utilities-adapter.js";

export class AuthenticateUserUseCase {
    constructor(
        private userRepository: KnexUserRepository,
        private passwordHasherRepository: PasswordHasherRepository,
        private updateUserUseCase: UpdateUserUseCase,
        private createJwtTokenRepository: CreateJwtTokenRepository
    ) { }

    async execute(email: string, password: string) {
        const objUserFound = await this.userRepository.getUserByEmail(email);
        if (!objUserFound || !objUserFound.password) {
            throw new Error(`${ErrorMessages.USER_UNAUTHORIZED} (cod.: 401001)`);
        }

        const isPasswordValid = await this.passwordHasherRepository.compare(password, objUserFound.password);
        if (!isPasswordValid) {
            throw new Error(`${ErrorMessages.USER_UNAUTHORIZED} (cod.: 401002)`);
        }

        const token = await this.createJwtTokenRepository.generateToken({ email: objUserFound.email, id: objUserFound.id });
        const objUserWithJwt = { ...objUserFound, token }
        await this.updateUserUseCase.execute(objUserWithJwt);

        return objUserWithJwt;
    }
}