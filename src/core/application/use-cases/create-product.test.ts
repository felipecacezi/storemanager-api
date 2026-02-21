import { expect } from "chai";
import { afterEach, beforeEach, describe, it } from "node:test";
import { fakerPT_BR as faker } from '@faker-js/faker';
import { CreateProductUseCase } from './create-product.js';
import sinon from "sinon";

describe('Create product cases tests', () => {
    let productRepositoryMock: any;
    let useCase: CreateProductUseCase;

    const fakeProduct = () => ({
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        cost_price: faker.number.int({ min: 100, max: 100000 }),
        sell_price: faker.number.int({ min: 100, max: 100000 }),
        inventory: faker.number.int({ min: 0, max: 1000 }),
    });

    beforeEach(() => {
        productRepositoryMock = {
            getByName: sinon.stub(),
            create: sinon.stub()
        };

        useCase = new CreateProductUseCase(productRepositoryMock);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('product successfully created', async () => {
        const product = fakeProduct();

        productRepositoryMock.getByName.resolves(null);
        productRepositoryMock.create.resolves({ id: 1, ...product });

        const result = await useCase.execute(product);

        expect(result).to.have.property('id', 1);
        expect(productRepositoryMock.create.calledOnce).to.be.true;
        expect(productRepositoryMock.getByName.calledWith(product.name)).to.be.true;
    });

    it('product already exists', async () => {
        const product = fakeProduct();

        productRepositoryMock.getByName.resolves({ id: 1, ...product });

        try {
            await useCase.execute(product);
        } catch (error: any) {
            expect(error.message).to.equal("Já existe um produto cadastrado com este nome (cod.: 400049)");
        }

        expect(productRepositoryMock.create.called).to.be.false;
    });

    it('product name is required', async () => {
        const product = { ...fakeProduct(), name: '' };

        try {
            await useCase.execute(product);
        } catch (error: any) {
            expect(error.message).to.equal("O nome do produto é obrigatório (cod.: 400046)");
        }

        expect(productRepositoryMock.create.called).to.be.false;
    });

    it('product cost_price is required', async () => {
        const product = { ...fakeProduct(), cost_price: undefined };

        try {
            await useCase.execute(product as any);
        } catch (error: any) {
            expect(error.message).to.equal("O preço de custo é obrigatório (cod.: 400047)");
        }

        expect(productRepositoryMock.create.called).to.be.false;
    });

    it('product cost_price must be integer', async () => {
        const product = { ...fakeProduct(), cost_price: 10.5 };

        try {
            await useCase.execute(product);
        } catch (error: any) {
            expect(error.message).to.equal("O preço de custo é obrigatório (cod.: 400047)");
        }

        expect(productRepositoryMock.create.called).to.be.false;
    });

    it('product sell_price is required', async () => {
        const product = { ...fakeProduct(), sell_price: undefined };

        try {
            await useCase.execute(product as any);
        } catch (error: any) {
            expect(error.message).to.equal("O preço de venda é obrigatório (cod.: 400048)");
        }

        expect(productRepositoryMock.create.called).to.be.false;
    });

    it('product sell_price must be integer', async () => {
        const product = { ...fakeProduct(), sell_price: 10.5 };

        try {
            await useCase.execute(product);
        } catch (error: any) {
            expect(error.message).to.equal("O preço de venda é obrigatório (cod.: 400048)");
        }

        expect(productRepositoryMock.create.called).to.be.false;
    });
});
