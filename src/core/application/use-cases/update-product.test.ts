import { expect } from "chai";
import { afterEach, beforeEach, describe, it } from "node:test";
import { fakerPT_BR as faker } from '@faker-js/faker';
import { UpdateProductUseCase } from './update-product.js';
import sinon from "sinon";

describe('Update product cases tests', () => {
    let productRepositoryMock: any;
    let useCase: UpdateProductUseCase;

    beforeEach(() => {
        productRepositoryMock = {
            getById: sinon.stub(),
            update: sinon.stub()
        };

        useCase = new UpdateProductUseCase(productRepositoryMock);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('product successfully updated', async () => {
        const fakeProduct = {
            id: 1,
            name: faker.commerce.productName(),
            cost_price: faker.number.int({ min: 100, max: 100000 }),
        };

        productRepositoryMock.getById.resolves(fakeProduct);
        productRepositoryMock.update.resolves(fakeProduct);

        const result = await useCase.execute(fakeProduct);

        expect(result).to.have.property('id', 1);
        expect(productRepositoryMock.getById.calledWith(fakeProduct.id)).to.be.true;
        expect(productRepositoryMock.update.calledOnce).to.be.true;
    });

    it('product not found', async () => {
        const fakeProduct = {
            id: 999,
            name: faker.commerce.productName(),
        };

        productRepositoryMock.getById.resolves(null);

        try {
            await useCase.execute(fakeProduct);
        } catch (error: any) {
            expect(error.message).to.equal("Produto não encontrado (cod.: 400050)");
        }

        expect(productRepositoryMock.update.called).to.be.false;
        expect(productRepositoryMock.getById.calledWith(fakeProduct.id)).to.be.true;
    });

    it('product id is required', async () => {
        const fakeProduct = {
            name: faker.commerce.productName(),
        };

        try {
            await useCase.execute(fakeProduct as any);
        } catch (error: any) {
            expect(error.message).to.equal("O id do produto é obrigatório (cod.: 400051)");
        }

        expect(productRepositoryMock.update.called).to.be.false;
        expect(productRepositoryMock.getById.called).to.be.false;
    });
});
