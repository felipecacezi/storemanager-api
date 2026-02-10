import { type Jwt } from "../../../core/domain/entities/Jwt.js"
import type { FastifyInstance } from 'fastify';

export class CreateJwtTokenRepository implements Jwt {

    constructor(private fastify: FastifyInstance) { }

    async generateToken(payload: any): Promise<string> {
        return this.fastify.jwt.sign(payload, { expiresIn: "1d" });
    }
    async verifyToken(token: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    async decodeToken(token: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
}