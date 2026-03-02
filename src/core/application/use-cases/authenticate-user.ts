import { KnexUserRepository } from "../../../infra/adapters/knex/user-repository.js"
import { PasswordHasherRepository } from "../../../infra/adapters/bcrypt/password-hasher-repository.js";
import { ErrorMessages } from "../../domain/erros/error-mesages.js";
import { UpdateUserTokenUseCase } from "./update-user-token.js";
import { CreateJwtTokenRepository } from "../../../infra/adapters/jwt/token-utilities-adapter.js";

export class AuthenticateUserUseCase {
    constructor(
        private userRepository: KnexUserRepository,
        private passwordHasherRepository: PasswordHasherRepository,
        private updateUserTokenUseCase: UpdateUserTokenUseCase,
        private createJwtTokenRepository: CreateJwtTokenRepository
    ) { }

    async execute(email: string, password: string) {
        const objUserFound = await this.userRepository.getUserByEmail(email);
        if (!objUserFound || !objUserFound.password) {
            throw new Error(`${ErrorMessages.USER_UNAUTHORIZED}`);
        }

        const isPasswordValid = await this.passwordHasherRepository.compare(password, objUserFound.password);
        if (!isPasswordValid) {
            throw new Error(`${ErrorMessages.USER_UNAUTHORIZED}`);
        }

        const token = await this.createJwtTokenRepository.generateToken({ email: objUserFound.email, id: objUserFound.id });
        const objUserWithJwt = { id: objUserFound.id, token: token }
        await this.updateUserTokenUseCase.execute(objUserWithJwt);
        return objUserWithJwt;
    }
}