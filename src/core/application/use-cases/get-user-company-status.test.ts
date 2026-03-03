import { expect } from "chai";
import { afterEach, beforeEach, describe, it } from "node:test";
import sinon from "sinon";
import { GetUserCompanyStatusUseCase } from "./get-user-company-status.js";
import { ErrorMessages } from "../../domain/erros/error-mesages.js";

describe("GetUserCompanyStatusUseCase", () => {
    let useCase: GetUserCompanyStatusUseCase;
    let userRepositoryMock: any;
    let companyRepositoryMock: any;

    beforeEach(() => {
        userRepositoryMock = {
            getUserById: sinon.stub(),
        };

        companyRepositoryMock = {
            getById: sinon.stub(),
        };

        useCase = new GetUserCompanyStatusUseCase(
            userRepositoryMock,
            companyRepositoryMock
        );
    });

    afterEach(() => {
        sinon.restore();
    });

    it("should return hasCompany=true when user has an active company", async () => {
        userRepositoryMock.getUserById.resolves({ id: 1, company_id: 10 });
        companyRepositoryMock.getById.resolves({ id: 10, status: true });

        const result = await useCase.execute({ userId: 1 });

        expect(result).to.deep.equal({ hasCompany: true, companyId: 10 });
        expect(userRepositoryMock.getUserById.calledWith(1)).to.be.true;
        expect(companyRepositoryMock.getById.calledWith(10)).to.be.true;
    });

    it("should return hasCompany=false when user has no company id", async () => {
        userRepositoryMock.getUserById.resolves({ id: 1, company_id: 0 });

        const result = await useCase.execute({ userId: 1 });

        expect(result).to.deep.equal({ hasCompany: false });
        expect(companyRepositoryMock.getById.called).to.be.false;
    });

    it("should return hasCompany=false when company record is missing", async () => {
        userRepositoryMock.getUserById.resolves({ id: 1, company_id: 99 });
        companyRepositoryMock.getById.resolves(null);

        const result = await useCase.execute({ userId: 1 });

        expect(result).to.deep.equal({ hasCompany: false });
    });

    it("should throw if user id is invalid", async () => {
        try {
            await useCase.execute({ userId: 0 });
            throw new Error("should have thrown");
        } catch (error: any) {
            expect(error.message).to.equal(ErrorMessages.USER_ID_REQUIRED);
        }
        expect(userRepositoryMock.getUserById.called).to.be.false;
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
