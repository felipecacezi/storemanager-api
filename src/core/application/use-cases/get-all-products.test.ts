import { expect } from "chai";
import { afterEach, beforeEach, describe, it } from "node:test";
import { fakerPT_BR as faker } from '@faker-js/faker';
import sinon from "sinon";
import { GetAllProductsUseCase } from "./get-all-products.js";

describe('Get all products cases tests', () => {
    let productRepository: any;
    let getAllProductsUseCase: GetAllProductsUseCase;

    beforeEach(() => {
        productRepository = {
            getAll: sinon.stub(),
        }
        getAllProductsUseCase = new GetAllProductsUseCase(productRepository);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should return all products', async () => {
        productRepository.getAll.resolves([
            {
                id: faker.number.int(),
                name: faker.commerce.productName(),
                cost_price: faker.number.int({ min: 100, max: 100000 }),
                sell_price: faker.number.int({ min: 100, max: 100000 }),
                inventory: faker.number.int({ min: 0, max: 1000 }),
            },
            {
                id: faker.number.int(),
                name: faker.commerce.productName(),
                cost_price: faker.number.int({ min: 100, max: 100000 }),
                sell_price: faker.number.int({ min: 100, max: 100000 }),
                inventory: faker.number.int({ min: 0, max: 1000 }),
            },
            {
                id: faker.number.int(),
                name: faker.commerce.productName(),
                cost_price: faker.number.int({ min: 100, max: 100000 }),
                sell_price: faker.number.int({ min: 100, max: 100000 }),
                inventory: faker.number.int({ min: 0, max: 1000 }),
            },
        ]);
        const products = await getAllProductsUseCase.execute({ page: 1, limit: 10 });
        expect(products).to.be.an('array');
        expect(products).to.have.lengthOf(3);
    });

    it('should throw an error if page is not provided', async () => {
        try {
            await getAllProductsUseCase.execute({ page: 0, limit: 10 });
        } catch (error) {
            expect(error).to.be.an('error');
            expect(error).to.have.property('message', 'A página é obrigatória (cod.: 400052)');
        }
    });

    it('should throw an error if limit is not provided', async () => {
        try {
            await getAllProductsUseCase.execute({ page: 1, limit: 0 });
        } catch (error) {
            expect(error).to.be.an('error');
            expect(error).to.have.property('message', 'O limite é obrigatório (cod.: 400054)');
        }
    });
});
