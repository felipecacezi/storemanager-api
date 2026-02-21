import { expect } from "chai";
import { afterEach, beforeEach, describe, it } from "node:test";
import { fakerPT_BR as faker } from '@faker-js/faker';
import { DeleteProductUseCase } from './delete-product.js';
import sinon from "sinon";

describe('Delete product cases tests', () => {
    let deleteProductUseCase: DeleteProductUseCase;
    let knexProductRepository: any;

    beforeEach(() => {
        knexProductRepository = {
            update: sinon.stub(),
            getById: sinon.stub(),
        };
        deleteProductUseCase = new DeleteProductUseCase(knexProductRepository);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should delete a product', async () => {
        const productId = faker.number.int();
        const product = { id: productId };

        knexProductRepository.getById.resolves({ id: productId });
        knexProductRepository.update.resolves({ id: productId, status: false });

        const result = await deleteProductUseCase.execute(product);
        expect(result).to.be.an('object');
    });

    it('should throw an error if product is not found', async () => {
        const productId = faker.number.int();
        const product = { id: productId };

        knexProductRepository.getById.resolves(null);
        knexProductRepository.update.resolves({ id: productId, status: false });

        try {
            await deleteProductUseCase.execute(product);
        } catch (error: any) {
            expect(error.message).to.equal("Produto não encontrado (cod.: 400050)");
        }

        expect(knexProductRepository.update.called).to.be.false;
    });

    it('should throw an error if product id is not provided', async () => {
        const product = { id: null };

        knexProductRepository.getById.resolves(null);
        knexProductRepository.update.resolves({ id: null, status: false });

        try {
            await deleteProductUseCase.execute(product as any);
        } catch (error: any) {
            expect(error.message).to.equal("O id do produto é obrigatório (cod.: 400051)");
        }

        expect(knexProductRepository.update.called).to.be.false;
    });
});
