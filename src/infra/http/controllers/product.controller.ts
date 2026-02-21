import type { FastifyRequest, FastifyReply } from "fastify";
import type { CreateProductUseCase } from "../../../core/application/use-cases/create-product.js";
import type { UpdateProductUseCase } from "../../../core/application/use-cases/update-product.js";
import type { DeleteProductUseCase } from "../../../core/application/use-cases/delete-product.js";
import type { GetAllProductsUseCase } from "../../../core/application/use-cases/get-all-products.js";

export class ProductController {
    constructor(
        private readonly createProductUseCase: CreateProductUseCase,
        private readonly updateProductUseCase: UpdateProductUseCase,
        private readonly deleteProductUseCase: DeleteProductUseCase,
        private readonly getAllProductsUseCase: GetAllProductsUseCase,
    ) { }

    async create(request: FastifyRequest, reply: FastifyReply) {
        const { name, description, cost_price, sell_price, inventory } = request.body as any;
        await this.createProductUseCase.execute({ name, description, cost_price, sell_price, inventory });
        return reply.status(201).send({ success: true, message: "Produto criado com sucesso!" });
    }

    async update(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as any;
        const data = request.body as any;
        await this.updateProductUseCase.execute({ id: Number(id), ...data });
        return reply.status(200).send({ success: true, message: "Produto atualizado com sucesso!" });
    }

    async delete(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as any;
        await this.deleteProductUseCase.execute({ id: Number(id) });
        return reply.status(200).send({ success: true, message: "Produto removido com sucesso!" });
    }

    async getAll(request: FastifyRequest, reply: FastifyReply) {
        const { page, limit } = request.query as any;
        const products = await this.getAllProductsUseCase.execute({ page: Number(page), limit: Number(limit) });
        return reply.status(200).send({ success: true, data: products });
    }
}
