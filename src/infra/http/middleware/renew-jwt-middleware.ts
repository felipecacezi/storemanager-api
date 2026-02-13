import type { FastifyRequest, FastifyReply } from "fastify";
import { CreateJwtTokenRepository } from "../../adapters/jwt/token-utilities-adapter.js";
import { KnexUserRepository } from "../../adapters/knex/user-repository.js";
import { PasswordHasherRepository } from "../../adapters/bcrypt/password-hasher-repository.js";

export async function refreshToken(
    request: FastifyRequest,
    reply: FastifyReply,
    payload: any
) {
    const token = request.headers.authorization?.replace('Bearer ', '');

    if (token) {
        const decoded = request.server.jwt.decode(token) as any;
        ''
        if (decoded) {
            const { exp, iat, nbf, ...cleanPayload } = decoded;
            const jwtRepository = new CreateJwtTokenRepository(request.server);
            const newToken = await jwtRepository.generateToken(cleanPayload);

            if (cleanPayload.id) {
                const passwordHasher = new PasswordHasherRepository();
                const userRepository = new KnexUserRepository(request.server.knex, passwordHasher);
                await userRepository.updateToken(cleanPayload.id, newToken);
            }

            reply.header('Authorization', `Bearer ${newToken}`);
            reply.header('Access-Control-Expose-Headers', 'Authorization');
        }
    }

    return payload;
}