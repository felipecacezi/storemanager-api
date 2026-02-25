import { expect } from "chai";
import { afterEach, beforeEach, describe, it } from "node:test";
import { fakerPT_BR as faker } from '@faker-js/faker';
import sinon from "sinon";
import { GetAllServicesUseCase } from "./get-all-services.js";

describe('Get all services cases tests', () => {
    let serviceRepository: any;
    let getAllServicesUseCase: GetAllServicesUseCase;

    beforeEach(() => {
        serviceRepository = {
            getAll: sinon.stub(),
        }
        getAllServicesUseCase = new GetAllServicesUseCase(serviceRepository);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should return all services', async () => {
        serviceRepository.getAll.resolves([
            {
                id: faker.number.int(),
                name: faker.commerce.productName(),
                service_price: faker.number.int({ min: 100, max: 100000 }),
            },
            {
                id: faker.number.int(),
                name: faker.commerce.productName(),
                service_price: faker.number.int({ min: 100, max: 100000 }),
            },
            {
                id: faker.number.int(),
                name: faker.commerce.productName(),
                service_price: faker.number.int({ min: 100, max: 100000 }),
            },
        ]);
        const services = await getAllServicesUseCase.execute({ page: 1, limit: 10, company_id: 1 });
        expect(services).to.be.an('array');
        expect(services).to.have.lengthOf(3);
    });

    it('should throw an error if page is not provided', async () => {
        try {
            await getAllServicesUseCase.execute({ page: 0, limit: 10, company_id: 1 });
        } catch (error) {
            expect(error).to.be.an('error');
            expect(error).to.have.property('message', 'A página é obrigatória (cod.: 400063)');
        }
    });

    it('should throw an error if limit is not provided', async () => {
        try {
            await getAllServicesUseCase.execute({ page: 1, limit: 0, company_id: 1 });
        } catch (error) {
            expect(error).to.be.an('error');
            expect(error).to.have.property('message', 'O limite é obrigatório (cod.: 400065)');
        }
    });
});
