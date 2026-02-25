import { expect } from "chai";
import { afterEach, beforeEach, describe, it } from "node:test";
import { fakerPT_BR as faker } from '@faker-js/faker';
import { CreateCompanyUseCase } from './create-company.js';
import sinon from "sinon";

describe('Create company cases tests', () => {
    let companyRepositoryMock: any;
    let useCase: CreateCompanyUseCase;

    const fakeCompany = () => ({
        document: faker.string.numeric(14),
        email: faker.internet.email(),
        phone: faker.phone.number(),
    });

    beforeEach(() => {
        companyRepositoryMock = {
            getByEmail: sinon.stub(),
            create: sinon.stub()
        };

        useCase = new CreateCompanyUseCase(companyRepositoryMock);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('company successfully created', async () => {
        const company = fakeCompany();

        companyRepositoryMock.getByEmail.resolves(null);
        companyRepositoryMock.create.resolves({ id: 1, ...company });

        const result = await useCase.execute(company);

        expect(result).to.have.property('id', 1);
        expect(companyRepositoryMock.create.calledOnce).to.be.true;
        expect(companyRepositoryMock.getByEmail.calledWith(company.email)).to.be.true;
    });

    it('company already exists', async () => {
        const company = fakeCompany();

        companyRepositoryMock.getByEmail.resolves({ id: 1, ...company });

        try {
            await useCase.execute(company);
        } catch (error: any) {
            expect(error.message).to.equal("Já existe uma empresa cadastrada com este e-mail (cod.: 400089)");
        }

        expect(companyRepositoryMock.create.called).to.be.false;
    });

    it('company document is required', async () => {
        const company = { ...fakeCompany(), document: '' };

        try {
            await useCase.execute(company);
        } catch (error: any) {
            expect(error.message).to.equal("O documento da empresa é obrigatório (cod.: 400085)");
        }

        expect(companyRepositoryMock.create.called).to.be.false;
    });

    it('company email is required', async () => {
        const company = { ...fakeCompany(), email: '' };

        try {
            await useCase.execute(company);
        } catch (error: any) {
            expect(error.message).to.equal("O e-mail da empresa é obrigatório (cod.: 400086)");
        }

        expect(companyRepositoryMock.create.called).to.be.false;
    });

    it('company email is invalid', async () => {
        const company = { ...fakeCompany(), email: 'emailinvalido' };

        try {
            await useCase.execute(company);
        } catch (error: any) {
            expect(error.message).to.equal("O e-mail da empresa é inválido (cod.: 400087)");
        }

        expect(companyRepositoryMock.create.called).to.be.false;
    });

    it('company phone is required', async () => {
        const company = { ...fakeCompany(), phone: '' };

        try {
            await useCase.execute(company);
        } catch (error: any) {
            expect(error.message).to.equal("O telefone da empresa é obrigatório (cod.: 400088)");
        }

        expect(companyRepositoryMock.create.called).to.be.false;
    });
});
