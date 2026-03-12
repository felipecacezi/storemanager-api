import type { KnexProductRepository } from "../../../infra/adapters/knex/product-repository.js";
import { ErrorMessages } from "../../domain/erros/error-mesages.js";
import { z } from "zod";

export class GetProductByIdUseCase {
    constructor(
        private productRepository: KnexProductRepository
    ) { }

    async execute(data: { id: number; company_id: number }) {
        const schema = z.object({
            id: z.number({ message: ErrorMessages.PRODUCT_ID_REQUIRED }),
            company_id: z.number({ message: ErrorMessages.COMPANY_ID_NOT_PROVIDED }),
        });

        const result = schema.safeParse(data);
        if (!result.success) {
            throw new Error(result.error.issues[0]?.message || "Erro de validação");
        }

        const product = await this.productRepository.getById(result.data.id, result.data.company_id);
        if (!product) {
            throw new Error(ErrorMessages.PRODUCT_NOT_FOUND);
        }

        return product;
    }
}
