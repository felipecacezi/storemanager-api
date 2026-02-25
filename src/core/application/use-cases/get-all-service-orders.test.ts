import { expect } from "chai";
import { afterEach, beforeEach, describe, it } from "node:test";
import { fakerPT_BR as faker } from '@faker-js/faker';
import sinon from "sinon";
import { GetAllServiceOrdersUseCase } from "./get-all-service-orders.js";

describe('Get all service orders cases tests', () => {
    let serviceOrderRepository: any;
    let useCase: GetAllServiceOrdersUseCase;

    beforeEach(() => {
        serviceOrderRepository = { getAll: sinon.stub() };
        useCase = new GetAllServiceOrdersUseCase(serviceOrderRepository);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should return all service orders', async () => {
        serviceOrderRepository.getAll.resolves([
            { id: 1, description: faker.lorem.sentence() },
            { id: 2, description: faker.lorem.sentence() },
            { id: 3, description: faker.lorem.sentence() },
        ]);
        const data = await useCase.execute({ page: 1, limit: 10, company_id: 1 });
        expect(data).to.be.an('array');
        expect(data).to.have.lengthOf(3);
    });

    it('should throw an error if page is invalid', async () => {
        try {
            await useCase.execute({ page: 0, limit: 10, company_id: 1 });
        } catch (error: any) {
            expect(error.message).to.equal('A página é obrigatória (cod.: 400077)');
        }
    });

    it('should throw an error if limit is invalid', async () => {
        try {
            await useCase.execute({ page: 1, limit: 0, company_id: 1 });
        } catch (error: any) {
            expect(error.message).to.equal('O limite é obrigatório (cod.: 400079)');
        }
    });
});
