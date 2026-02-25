import { expect } from "chai";
import { afterEach, beforeEach, describe, it } from "node:test";
import { fakerPT_BR as faker } from '@faker-js/faker';
import sinon from "sinon";
import { GetAllCompaniesUseCase } from "./get-all-companies.js";

describe('Get all companies cases tests', () => {
    let companyRepository: any;
    let getAllCompaniesUseCase: GetAllCompaniesUseCase;

    beforeEach(() => {
        companyRepository = {
            getAll: sinon.stub(),
        }
        getAllCompaniesUseCase = new GetAllCompaniesUseCase(companyRepository);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should return all companies', async () => {
        companyRepository.getAll.resolves([
            {
                id: faker.number.int(),
                email: faker.internet.email(),
                phone: faker.phone.number(),
            },
            {
                id: faker.number.int(),
                email: faker.internet.email(),
                phone: faker.phone.number(),
            },
            {
                id: faker.number.int(),
                email: faker.internet.email(),
                phone: faker.phone.number(),
            },
        ]);
        const companies = await getAllCompaniesUseCase.execute({ page: 1, limit: 10 });
        expect(companies).to.be.an('array');
        expect(companies).to.have.lengthOf(3);
    });

    it('should throw an error if page is not provided', async () => {
        try {
            await getAllCompaniesUseCase.execute({ page: 0, limit: 10 });
        } catch (error) {
            expect(error).to.be.an('error');
            expect(error).to.have.property('message', 'A página é obrigatória (cod.: 400092)');
        }
    });

    it('should throw an error if limit is not provided', async () => {
        try {
            await getAllCompaniesUseCase.execute({ page: 1, limit: 0 });
        } catch (error) {
            expect(error).to.be.an('error');
            expect(error).to.have.property('message', 'O limite é obrigatório (cod.: 400094)');
        }
    });
});
