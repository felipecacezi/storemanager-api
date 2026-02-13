import type { User } from "../../domain/entities/User.js";

export interface UserRepository {
    create(user: User): Promise<User | null>;
    update(user: User): Promise<User | null>;
    updateToken(id: number, token: string): Promise<void>;
}