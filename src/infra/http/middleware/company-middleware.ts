import type { FastifyRequest, FastifyReply } from 'fastify';
import { ErrorMessages } from '../../../core/domain/erros/error-mesages.js';
import { ErroCodes } from '../../../core/domain/enums/error-codes.js';

export async function companyMiddleware(request: FastifyRequest, reply: FastifyReply) {
    const companyId = request.headers['x-company-id'];

    if (!companyId) {
        return reply.status(400).send({
            success: false,
            message: ErrorMessages[ErroCodes.COMPANY_ID_NOT_PROVIDED],
        });
    }

    const companyIdNumber = Number(companyId);

    if (isNaN(companyIdNumber) || companyIdNumber <= 0) {
        return reply.status(400).send({
            success: false,
            message: ErrorMessages[ErroCodes.COMPANY_ID_INVALID],
        });
    }
}
