import { expect } from "chai";
import { afterEach, beforeEach, describe, it } from "node:test";
import sinon from "sinon";
import { GetCompanyForUserUseCase } from "./get-company-for-user.js";
import { ErrorMessages } from "../../domain/erros/error-mesages.js";

describe("GetCompanyForUserUseCase", () => {
    let useCase: GetCompanyForUserUseCase;
    let userRepositoryMock: any;
    let companyRepositoryMock: any;

    beforeEach(() => {
        userRepositoryMock = {
            getUserById: sinon.stub(),
        };

        companyRepositoryMock = {
            getById: sinon.stub(),
        };

        useCase = new GetCompanyForUserUseCase(userRepositoryMock, companyRepositoryMock);
    });

    afterEach(() => {
        sinon.restore();
    });

    it("should return company when user has an active company", async () => {
        userRepositoryMock.getUserById.resolves({ id: 1, company_id: 10 });
        companyRepositoryMock.getById.resolves({ id: 10, status: true, name: "ACME", email: "a@b.com", document: "1", phone: "2" });

        const result = await useCase.execute({ userId: 1 });

        expect(result).to.have.property("id", 10);
    });

    it("should return null when user has no company", async () => {
        userRepositoryMock.getUserById.resolves({ id: 1, company_id: 0 });

        const result = await useCase.execute({ userId: 1 });

        expect(result).to.equal(null);
        expect(companyRepositoryMock.getById.called).to.be.false;
    });

    it("should return null when company does not exist", async () => {
        userRepositoryMock.getUserById.resolves({ id: 1, company_id: 10 });
        companyRepositoryMock.getById.resolves(null);

        const result = await useCase.execute({ userId: 1 });

        expect(result).to.equal(null);
    });

    it("should return null when company is inactive", async () => {
        userRepositoryMock.getUserById.resolves({ id: 1, company_id: 10 });
        companyRepositoryMock.getById.resolves({ id: 10, status: false });

        const result = await useCase.execute({ userId: 1 });

        expect(result).to.equal(null);
    });

    it("should throw if user id is invalid", async () => {
        try {
            await useCase.execute({ userId: 0 });
            throw new Error("should have thrown");
        } catch (error: any) {
            expect(error.message).to.equal(ErrorMessages.USER_ID_REQUIRED);
        }
    });

    it("should throw if user is not found", async () => {
        userRepositoryMock.getUserById.resolves(null);

        try {
            await useCase.execute({ userId: 1 });
            throw new Error("should have thrown");
        } catch (error: any) {
            expect(error.message).to.equal(ErrorMessages.USER_NOT_FOUND);
        }

        expect(companyRepositoryMock.getById.called).to.be.false;
    });
});
