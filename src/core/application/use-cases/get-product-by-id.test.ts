import { expect } from "chai";
import { afterEach, beforeEach, describe, it } from "node:test";
import { fakerPT_BR as faker } from '@faker-js/faker';
import sinon from "sinon";
import { GetProductByIdUseCase } from "./get-product-by-id.js";

describe('Get product by id cases tests', () => {
    let productRepository: any;
    let getProductByIdUseCase: GetProductByIdUseCase;

    beforeEach(() => {
        productRepository = {
            getById: sinon.stub(),
        }
        getProductByIdUseCase = new GetProductByIdUseCase(productRepository);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should return a product by id', async () => {
        const productData = {
            id: faker.number.int(),
            company_id: 1,
            name: faker.commerce.productName(),
            cost_price: 1000,
            sell_price: 2000,
            inventory: 10,
            status: true
        };
        productRepository.getById.resolves(productData);

        const product = await getProductByIdUseCase.execute({ id: productData.id, company_id: 1 });
        expect(product).to.be.an('object');
        expect(product).to.have.property('id', productData.id);
        expect(product.name).to.equal(productData.name);
    });

    it('should throw an error if product is not found', async () => {
        productRepository.getById.resolves(null);

        try {
            await getProductByIdUseCase.execute({ id: 1, company_id: 1 });
            expect.fail("Should have thrown an error");
        } catch (error: any) {
            expect(error.message).to.equal("Produto não encontrado (cod.: 400050)");
        }
    });

    it('should throw an error if product id is missing', async () => {
        try {
            await getProductByIdUseCase.execute({ id: null as any, company_id: 1 });
            expect.fail("Should have thrown an error");
        } catch (error: any) {
            expect(error.message).to.equal("O id do produto é obrigatório (cod.: 400051)");
        }
    });

    it('should throw an error if company id is missing', async () => {
        try {
            await getProductByIdUseCase.execute({ id: 1, company_id: null as any });
            expect.fail("Should have thrown an error");
        } catch (error: any) {
            expect(error.message).to.equal("O id da empresa (company_id) é obrigatório e deve ser informado no header x-company-id (cod.: 400098)");
        }
    });
});
