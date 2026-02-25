import type { FastifyInstance } from "fastify";
import { ProductController } from "../controllers/product.controller.js";
import { KnexProductRepository } from "../../adapters/knex/product-repository.js";
import { CreateProductUseCase } from "../../../core/application/use-cases/create-product.js";
import { UpdateProductUseCase } from "../../../core/application/use-cases/update-product.js";
import { DeleteProductUseCase } from "../../../core/application/use-cases/delete-product.js";
import { GetAllProductsUseCase } from "../../../core/application/use-cases/get-all-products.js";
import { authMiddleware } from "../middleware/auth-middleware.js";
import { companyMiddleware } from "../middleware/company-middleware.js";

export async function productRoute(app: FastifyInstance) {
    const productRepository = new KnexProductRepository(app.knex);

    const createProductUseCase = new CreateProductUseCase(productRepository);
    const updateProductUseCase = new UpdateProductUseCase(productRepository);
    const deleteProductUseCase = new DeleteProductUseCase(productRepository);
    const getAllProductsUseCase = new GetAllProductsUseCase(productRepository);

    const productController = new ProductController(
        createProductUseCase,
        updateProductUseCase,
        deleteProductUseCase,
        getAllProductsUseCase
    );

    app.addHook('onRequest', authMiddleware);
    app.addHook('onRequest', companyMiddleware);

    app.post('/products', async (request, reply) => {
        return await productController.create(request, reply);
    });

    app.put('/products/:id', async (request, reply) => {
        return await productController.update(request, reply);
    });

    app.delete('/products/:id', async (request, reply) => {
        return await productController.delete(request, reply);
    });

    app.get('/products', async (request, reply) => {
        return await productController.getAll(request, reply);
    });
}