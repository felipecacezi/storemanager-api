import { expect } from "chai";
import { afterEach, beforeEach, describe, it } from "node:test";
import { fakerPT_BR as faker } from "@faker-js/faker";
import sinon from "sinon";
import { GetVendorByIdUseCase } from "./get-vendor-by-id.js";

describe("Get vendor by id cases tests", () => {
    let vendorRepositoryMock: any;
    let useCase: GetVendorByIdUseCase;

    beforeEach(() => {
        vendorRepositoryMock = {
            getById: sinon.stub(),
        };

        useCase = new GetVendorByIdUseCase(vendorRepositoryMock);
    });

    afterEach(() => {
        sinon.restore();
    });

    it("should return a vendor by id", async () => {
        const vendor = {
            id: faker.number.int(),
            company_id: 1,
            name: faker.person.fullName(),
            email: faker.internet.email(),
            document: faker.string.numeric(11),
            phone: faker.string.numeric(11),
        };

        vendorRepositoryMock.getById.resolves(vendor);

        const result = await useCase.execute({ id: vendor.id, company_id: vendor.company_id });

        expect(result).to.have.property("id", vendor.id);
        expect(vendorRepositoryMock.getById.calledWith(vendor.id, vendor.company_id)).to.be.true;
    });

    it("should throw an error if vendor is not found", async () => {
        vendorRepositoryMock.getById.resolves(null);

        try {
            await useCase.execute({ id: 999, company_id: 1 });
        } catch (error: any) {
            expect(error.message).to.equal("Fornecedor não encontrado (cod.: 400037)");
        }
    });

    it("should throw an error if id is not provided", async () => {
        try {
            await useCase.execute({ company_id: 1 } as any);
        } catch (error: any) {
            expect(error.message).to.equal("O id do fornecedor é obrigatório (cod.: 400038)");
        }

        expect(vendorRepositoryMock.getById.called).to.be.false;
    });
});
