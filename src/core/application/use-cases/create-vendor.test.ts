import { expect } from "chai";
import { afterEach, beforeEach, describe, it } from "node:test";
import { fakerPT_BR as faker } from '@faker-js/faker';
import { CreateVendorUseCase } from './create-vendor.js';
import sinon from "sinon";

describe('Create vendor cases tests', () => {
    let vendorRepositoryMock: any;
    let useCase: CreateVendorUseCase;

    const fakeVendor = () => ({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        document: faker.string.numeric(11),
        phone: faker.phone.number(),
    });

    beforeEach(() => {
        vendorRepositoryMock = {
            getByEmail: sinon.stub(),
            create: sinon.stub()
        };

        useCase = new CreateVendorUseCase(vendorRepositoryMock);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('vendor successfully created', async () => {
        const vendor = fakeVendor();

        vendorRepositoryMock.getByEmail.resolves(null);
        vendorRepositoryMock.create.resolves({ id: 1, ...vendor });

        const result = await useCase.execute(vendor);

        expect(result).to.have.property('id', 1);
        expect(vendorRepositoryMock.create.calledOnce).to.be.true;
        expect(vendorRepositoryMock.getByEmail.calledWith(vendor.email)).to.be.true;
    });

    it('vendor already exists', async () => {
        const vendor = fakeVendor();

        vendorRepositoryMock.getByEmail.resolves({ id: 1, ...vendor });

        try {
            await useCase.execute(vendor);
        } catch (error: any) {
            expect(error.message).to.equal("Já existe um fornecedor cadastrado com este e-mail (cod.: 400036)");
        }

        expect(vendorRepositoryMock.create.called).to.be.false;
    });

    it('vendor name is required', async () => {
        const vendor = { ...fakeVendor(), name: '' };

        try {
            await useCase.execute(vendor);
        } catch (error: any) {
            expect(error.message).to.equal("O nome do fornecedor é obrigatório (cod.: 400032)");
        }

        expect(vendorRepositoryMock.create.called).to.be.false;
    });

    it('vendor email is required', async () => {
        const vendor = { ...fakeVendor(), email: '' };

        try {
            await useCase.execute(vendor);
        } catch (error: any) {
            expect(error.message).to.equal("O e-mail do fornecedor é obrigatório (cod.: 400033)");
        }

        expect(vendorRepositoryMock.create.called).to.be.false;
    });

    it('vendor email is invalid', async () => {
        const vendor = { ...fakeVendor(), email: 'emailinvalido' };

        try {
            await useCase.execute(vendor);
        } catch (error: any) {
            expect(error.message).to.equal("O e-mail do fornecedor é inválido (cod.: 400034)");
        }

        expect(vendorRepositoryMock.create.called).to.be.false;
    });

    it('vendor document is required', async () => {
        const vendor = { ...fakeVendor(), document: '' };

        try {
            await useCase.execute(vendor);
        } catch (error: any) {
            expect(error.message).to.equal("O documento do fornecedor é obrigatório (cod.: 400035)");
        }

        expect(vendorRepositoryMock.create.called).to.be.false;
    });

    it('vendor phone is required', async () => {
        const vendor = { ...fakeVendor(), phone: '' };

        try {
            await useCase.execute(vendor);
        } catch (error: any) {
            expect(error.message).to.equal("O telefone do fornecedor é obrigatório (cod.: 400039)");
        }

        expect(vendorRepositoryMock.create.called).to.be.false;
    });
});
