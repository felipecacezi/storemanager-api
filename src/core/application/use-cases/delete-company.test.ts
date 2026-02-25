import { expect } from "chai";
import { afterEach, beforeEach, describe, it } from "node:test";
import { fakerPT_BR as faker } from '@faker-js/faker';
import { DeleteCompanyUseCase } from './delete-company.js';
import sinon from "sinon";

describe('Delete company cases tests', () => {
    let deleteCompanyUseCase: DeleteCompanyUseCase;
    let knexCompanyRepository: any;

    beforeEach(() => {
        knexCompanyRepository = {
            update: sinon.stub(),
            getById: sinon.stub(),
        };
        deleteCompanyUseCase = new DeleteCompanyUseCase(knexCompanyRepository);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should delete a company', async () => {
        const companyId = faker.number.int();
        const company = { id: companyId };

        knexCompanyRepository.getById.resolves({ id: companyId });
        knexCompanyRepository.update.resolves({ id: companyId, status: false });

        const result = await deleteCompanyUseCase.execute(company);
        expect(result).to.be.an('object');
    });

    it('should throw an error if company is not found', async () => {
        const companyId = faker.number.int();
        const company = { id: companyId };

        knexCompanyRepository.getById.resolves(null);
        knexCompanyRepository.update.resolves({ id: companyId, status: false });

        try {
            await deleteCompanyUseCase.execute(company);
        } catch (error: any) {
            expect(error.message).to.equal("Empresa não encontrada (cod.: 400090)");
        }

        expect(knexCompanyRepository.update.called).to.be.false;
    });

    it('should throw an error if company id is not provided', async () => {
        const company = { id: null };

        knexCompanyRepository.getById.resolves(null);
        knexCompanyRepository.update.resolves({ id: null, status: false });

        try {
            await deleteCompanyUseCase.execute(company as any);
        } catch (error: any) {
            expect(error.message).to.equal("O id da empresa é obrigatório (cod.: 400091)");
        }

        expect(knexCompanyRepository.update.called).to.be.false;
    });
});
