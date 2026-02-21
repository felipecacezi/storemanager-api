import type { KnexProductRepository } from "../../../infra/adapters/knex/product-repository.js";
import type { ProductUpdate } from "../../domain/entities/Product.js";
import { ErrorMessages } from "../../domain/erros/error-mesages.js";
import { z } from "zod";

export class DeleteProductUseCase {
    constructor(
        private productRepository: KnexProductRepository,
    ) { }

    async execute(product: ProductUpdate) {
        const schema = z.object({
            id: z.number({
                message: ErrorMessages.PRODUCT_ID_REQUIRED,
                invalid_type_error: ErrorMessages.PRODUCT_ID_REQUIRED
            })
        });

        const result = schema.safeParse(product);
        if (!result.success) {
            throw new Error(result.error.issues[0].message);
        }

        const productExists = await this.productRepository.getById(result.data.id);
        if (!productExists) {
            throw new Error(ErrorMessages.PRODUCT_NOT_FOUND);
        }

        return await this.productRepository.update({ id: result.data.id, status: false });
    }
}
