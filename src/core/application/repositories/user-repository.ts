import type { User, UserUpdate } from "../../domain/entities/User.js";

export interface UserRepository {
    create(user: User): Promise<User | null>;
    update(user: UserUpdate): Promise<UserUpdate | null>;
    updateToken(id: number, token: string): Promise<void>;
}