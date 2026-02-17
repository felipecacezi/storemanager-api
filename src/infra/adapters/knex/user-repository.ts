import type { Knex } from "knex";
import type { User, UserUpdate } from "../../../core/domain/entities/User.js";
import type { UserRepository } from "../../../core/application/repositories/user-repository.js";

export class KnexUserRepository implements UserRepository {
    constructor(
        private readonly db: Knex
    ) { }

    async create(user: User): Promise<User | null> {
        return await this.db("users").insert({
            name: user.name,
            email: user.email,
            password: user.password,
        });
    }

    async getUserByEmail(email: string): Promise<User | null> {
        return await this.db("users").where({ email }).first();
    }

    async getUserById(id: number): Promise<User | null> {
        return await this.db("users").where({ id }).first();
    }

    async update(user: UserUpdate): Promise<UserUpdate | null> {
        return await this.db("users").where({ id: user.id }).update(user);
    }

    async updateToken(id: number, token: string): Promise<void> {
        await this.db("users").where({ id }).update({ token });
    }
}