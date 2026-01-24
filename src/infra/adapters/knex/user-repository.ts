import type { Knex } from "knex";
import type { User } from "../../../core/domain/entities/User.js";
import type { UserRepository } from "../../../core/application/repositories/user-repository.js";

export class KnexUserRepository implements UserRepository {
    constructor(private readonly db: Knex) { }

    async create(user: User): Promise<User | null> {
        return await this.db("users").insert({
            id: user.id,
            name: user.name,
            email: user.email,
            password: user.password,
        });
    }
}