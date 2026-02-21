import { expect } from "chai";
import { afterEach, beforeEach, describe, it } from "node:test";
import { fakerPT_BR as faker } from '@faker-js/faker';
import sinon from "sinon";
import { GetAllVendorsUseCase } from "./get-all-vendors.js";

describe('Get all vendors cases tests', () => {
    let vendorRepository: any;
    let getAllVendorsUseCase: GetAllVendorsUseCase;

    beforeEach(() => {
        vendorRepository = {
            getAll: sinon.stub(),
        }
        getAllVendorsUseCase = new GetAllVendorsUseCase(vendorRepository);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should return all vendors', async () => {
        vendorRepository.getAll.resolves([
            {
                id: faker.string.uuid(),
                name: faker.person.fullName(),
                email: faker.internet.email(),
                phone: faker.string.numeric(11),
                createdAt: faker.date.recent(),
                updatedAt: faker.date.recent(),
            },
            {
                id: faker.string.uuid(),
                name: faker.person.fullName(),
                email: faker.internet.email(),
                phone: faker.string.numeric(11),
                createdAt: faker.date.recent(),
                updatedAt: faker.date.recent(),
            },
            {
                id: faker.string.uuid(),
                name: faker.person.fullName(),
                email: faker.internet.email(),
                phone: faker.string.numeric(11),
                createdAt: faker.date.recent(),
                updatedAt: faker.date.recent(),
            },
        ]);
        const vendors = await getAllVendorsUseCase.execute({ page: 1, limit: 10 });
        expect(vendors).to.be.an('array');
        expect(vendors).to.have.lengthOf(3);
    });

    it('should throw an error if page is not provided', async () => {
        try {
            await getAllVendorsUseCase.execute({ page: 0, limit: 10 });
        } catch (error) {
            expect(error).to.be.an('error');
            expect(error).to.have.property('message', 'A página do fornecedor é obrigatória (cod.: 400040)');
        }
    });

    it('should throw an error if limit is not provided', async () => {
        try {
            await getAllVendorsUseCase.execute({ page: 1, limit: 0 });
        } catch (error) {
            expect(error).to.be.an('error');
            expect(error).to.have.property('message', 'O limite do fornecedor é obrigatório (cod.: 400042)');
        }
    });
});
