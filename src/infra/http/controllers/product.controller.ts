import type { FastifyRequest, FastifyReply } from "fastify";
import type { CreateProductUseCase } from "../../../core/application/use-cases/create-product.js";
import type { UpdateProductUseCase } from "../../../core/application/use-cases/update-product.js";
import type { DeleteProductUseCase } from "../../../core/application/use-cases/delete-product.js";
import type { GetAllProductsUseCase } from "../../../core/application/use-cases/get-all-products.js";
import type { GetProductByIdUseCase } from "../../../core/application/use-cases/get-product-by-id.js";

export class ProductController {
    constructor(
        private readonly createProductUseCase: CreateProductUseCase,
        private readonly updateProductUseCase: UpdateProductUseCase,
        private readonly deleteProductUseCase: DeleteProductUseCase,
        private readonly getAllProductsUseCase: GetAllProductsUseCase,
        private readonly getProductByIdUseCase: GetProductByIdUseCase,
    ) { }

    async create(request: FastifyRequest, reply: FastifyReply) {
        const company_id = Number(request.headers['x-company-id']);
        const { name, description, cost_price, sell_price, inventory } = request.body as any;
        await this.createProductUseCase.execute({ company_id, name, description, cost_price, sell_price, inventory });
        return reply.status(201).send({ success: true, message: "Produto criado com sucesso!" });
    }

    async update(request: FastifyRequest, reply: FastifyReply) {
        const company_id = Number(request.headers['x-company-id']);
        const { id } = request.params as any;
        const data = request.body as any;
        await this.updateProductUseCase.execute({ id: Number(id), company_id, ...data });
        return reply.status(200).send({ success: true, message: "Produto atualizado com sucesso!" });
    }

    async delete(request: FastifyRequest, reply: FastifyReply) {
        const company_id = Number(request.headers['x-company-id']);
        const { id } = request.params as any;
        await this.deleteProductUseCase.execute({ id: Number(id), company_id });
        return reply.status(200).send({ success: true, message: "Produto removido com sucesso!" });
    }

    async getAll(request: FastifyRequest, reply: FastifyReply) {
        const company_id = Number(request.headers['x-company-id']);
        const { page, limit, status } = request.query as any;

        let statusFilter: boolean | undefined = undefined;
        if (status === "true") statusFilter = true;
        else if (status === "false") statusFilter = false;

        const products = await this.getAllProductsUseCase.execute({
            page: Number(page),
            limit: Number(limit),
            company_id,
            status: statusFilter
        });
        return reply.status(200).send({ success: true, data: products });
    }

    async getById(request: FastifyRequest, reply: FastifyReply) {
        const company_id = Number(request.headers['x-company-id']);
        const { id } = request.params as any;
        const product = await this.getProductByIdUseCase.execute({ id: Number(id), company_id });
        return reply.status(200).send({ success: true, data: product });
    }
}
