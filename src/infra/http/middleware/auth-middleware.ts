import type { FastifyRequest, FastifyReply } from 'fastify';
import { ErrorMessages } from '../../../core/domain/erros/error-mesages.js';
import { ErroCodes } from '../../../core/domain/enums/error-codes.js';
import jwt from 'jsonwebtoken';


export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
    const token = request.headers.authorization?.replace('Bearer ', '');



    if (!token) {
        return reply.status(401).send({ message: ErrorMessages[ErroCodes.TOKEN_NOT_PROVIDED] });
    }

    try {
        const decodedToken = jwt.verify(token, 'sua-chave-secreta-super-segura');

        if (
            typeof decodedToken !== 'string'
            && decodedToken.exp
            && decodedToken.exp < Math.floor(Date.now() / 1000)
        ) {
            return reply.status(401).send({ message: ErrorMessages[ErroCodes.TOKEN_INVALID] });
        }

    } catch (error) {
        return reply.status(401).send({ message: ErrorMessages[ErroCodes.TOKEN_INVALID] });
    }
}