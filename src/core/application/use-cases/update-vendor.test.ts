import { expect } from "chai";
import { afterEach, beforeEach, describe, it } from "node:test";
import { fakerPT_BR as faker } from '@faker-js/faker';
import { UpdateVendorUseCase } from './update-vendor.js';
import sinon from "sinon";

describe('Update vendor cases tests', () => {
    let vendorRepositoryMock: any;
    let useCase: UpdateVendorUseCase;

    beforeEach(() => {
        vendorRepositoryMock = {
            getById: sinon.stub(),
            update: sinon.stub()
        };

        useCase = new UpdateVendorUseCase(vendorRepositoryMock);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('vendor successfully updated', async () => {
        const fakeVendor = {
            id: 1,
            name: faker.person.fullName(),
            email: faker.internet.email(),
        };

        vendorRepositoryMock.getById.resolves(fakeVendor);
        vendorRepositoryMock.update.resolves(fakeVendor);

        const result = await useCase.execute(fakeVendor);

        expect(result).to.have.property('id', 1);
        expect(vendorRepositoryMock.getById.calledWith(fakeVendor.id)).to.be.true;
        expect(vendorRepositoryMock.update.calledOnce).to.be.true;
    });

    it('vendor not found', async () => {
        const fakeVendor = {
            id: 999,
            name: faker.person.fullName(),
        };

        vendorRepositoryMock.getById.resolves(null);

        try {
            await useCase.execute(fakeVendor);
        } catch (error: any) {
            expect(error.message).to.equal("Fornecedor não encontrado (cod.: 400037)");
        }

        expect(vendorRepositoryMock.update.called).to.be.false;
        expect(vendorRepositoryMock.getById.calledWith(fakeVendor.id)).to.be.true;
    });

    it('vendor id is required', async () => {
        const fakeVendor = {
            name: faker.person.fullName(),
        };

        try {
            await useCase.execute(fakeVendor as any);
        } catch (error: any) {
            expect(error.message).to.equal("O id do fornecedor é obrigatório (cod.: 400038)");
        }

        expect(vendorRepositoryMock.update.called).to.be.false;
        expect(vendorRepositoryMock.getById.called).to.be.false;
    });
});
