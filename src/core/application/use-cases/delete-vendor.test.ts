import { expect } from "chai";
import { afterEach, beforeEach, describe, it } from "node:test";
import { fakerPT_BR as faker } from '@faker-js/faker';
import { DeleteVendorUseCase } from './delete-vendor.js';
import sinon from "sinon";

describe('Delete vendor cases tests', () => {
    let deleteVendorUseCase: DeleteVendorUseCase;
    let knexVendorRepository: any;

    beforeEach(() => {
        knexVendorRepository = {
            update: sinon.stub(),
            getById: sinon.stub(),
        };
        deleteVendorUseCase = new DeleteVendorUseCase(knexVendorRepository);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should delete a vendor', async () => {
        const vendorId = faker.number.int();
        const vendor = { id: vendorId };

        knexVendorRepository.getById.resolves({ id: vendorId });
        knexVendorRepository.update.resolves({ id: vendorId, status: false });

        const result = await deleteVendorUseCase.execute(vendor);
        expect(result).to.be.an('object');
    });

    it('should throw an error if vendor is not found', async () => {
        const vendorId = faker.number.int();
        const vendor = { id: vendorId };

        knexVendorRepository.getById.resolves(null);
        knexVendorRepository.update.resolves({ id: vendorId, status: false });

        try {
            await deleteVendorUseCase.execute(vendor);
        } catch (error: any) {
            expect(error.message).to.equal("Fornecedor não encontrado (cod.: 400037)");
        }

        expect(knexVendorRepository.update.called).to.be.false;
    });

    it('should throw an error if vendor id is not provided', async () => {
        const vendor = { id: null };

        knexVendorRepository.getById.resolves(null);
        knexVendorRepository.update.resolves({ id: null, status: false });

        try {
            await deleteVendorUseCase.execute(vendor as any);
        } catch (error: any) {
            expect(error.message).to.equal("O id do fornecedor é obrigatório (cod.: 400038)");
        }

        expect(knexVendorRepository.update.called).to.be.false;
    });
});
