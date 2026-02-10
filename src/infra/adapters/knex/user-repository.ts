import type { Knex } from "knex";
import type { User } from "../../../core/domain/entities/User.js";
import type { UserRepository } from "../../../core/application/repositories/user-repository.js";
import { PasswordHasherRepository } from "../bcrypt/password-hasher-repository.js";
import { ErrorMessages } from "../../../core/domain/erros/error-mesages.js";

export class KnexUserRepository implements UserRepository {
    constructor(
        private readonly db: Knex,
        private readonly passwordHasherRepository: PasswordHasherRepository
    ) { }

    async create(user: User): Promise<User | null> {
        if (!user.password) {
            throw new Error(ErrorMessages.USER_PASSWORD_REQUIRED);
        }
        const hashedPassword = await this.passwordHasherRepository.hash(user.password);
        return await this.db("users").insert({
            name: user.name,
            email: user.email,
            password: hashedPassword,
        });
    }

    async getUserByEmail(email: string): Promise<User | null> {
        return await this.db("users").where({ email }).first();
    }

    async getUserById(id: number): Promise<User | null> {
        return await this.db("users").where({ id }).first();
    }

    async update(user: User): Promise<User | null> {
        return await this.db("users").where({ id: user.id }).update(user);
    }
}