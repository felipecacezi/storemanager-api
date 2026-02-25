import { expect } from "chai";
import { afterEach, beforeEach, describe, it } from "node:test";
import { fakerPT_BR as faker } from '@faker-js/faker';
import { UpdateCompanyUseCase } from './update-company.js';
import sinon from "sinon";

describe('Update company cases tests', () => {
    let companyRepositoryMock: any;
    let useCase: UpdateCompanyUseCase;

    beforeEach(() => {
        companyRepositoryMock = {
            getById: sinon.stub(),
            update: sinon.stub()
        };

        useCase = new UpdateCompanyUseCase(companyRepositoryMock);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('company successfully updated', async () => {
        const fakeCompany = {
            id: 1,
            email: faker.internet.email(),
        };

        companyRepositoryMock.getById.resolves(fakeCompany);
        companyRepositoryMock.update.resolves(fakeCompany);

        const result = await useCase.execute(fakeCompany);

        expect(result).to.have.property('id', 1);
        expect(companyRepositoryMock.getById.calledWith(fakeCompany.id)).to.be.true;
        expect(companyRepositoryMock.update.calledOnce).to.be.true;
    });

    it('company not found', async () => {
        const fakeCompany = {
            id: 999,
            email: faker.internet.email(),
        };

        companyRepositoryMock.getById.resolves(null);

        try {
            await useCase.execute(fakeCompany);
        } catch (error: any) {
            expect(error.message).to.equal("Empresa não encontrada (cod.: 400090)");
        }

        expect(companyRepositoryMock.update.called).to.be.false;
        expect(companyRepositoryMock.getById.calledWith(fakeCompany.id)).to.be.true;
    });

    it('company id is required', async () => {
        const fakeCompany = {
            email: faker.internet.email(),
        };

        try {
            await useCase.execute(fakeCompany as any);
        } catch (error: any) {
            expect(error.message).to.equal("O id da empresa é obrigatório (cod.: 400091)");
        }

        expect(companyRepositoryMock.update.called).to.be.false;
        expect(companyRepositoryMock.getById.called).to.be.false;
    });
});
