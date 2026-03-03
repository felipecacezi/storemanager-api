import { expect } from "chai";
import { afterEach, beforeEach, describe, it } from "node:test";
import sinon from "sinon";
import { fakerPT_BR as faker } from "@faker-js/faker";
import { CreateCompanyForUserUseCase } from "./create-company-for-user.js";
import { CreateCompanyUseCase } from "./create-company.js";
import { ErrorMessages } from "../../domain/erros/error-mesages.js";

describe("CreateCompanyForUserUseCase", () => {
    let useCase: CreateCompanyForUserUseCase;
    let userRepositoryMock: any;
    let companyRepositoryMock: any;

    beforeEach(() => {
        userRepositoryMock = {
            getUserById: sinon.stub(),
            updateCompanyId: sinon.stub(),
        };

        companyRepositoryMock = {
            getByEmail: sinon.stub(),
            create: sinon.stub(),
        };

        const createCompanyUseCase = new CreateCompanyUseCase(companyRepositoryMock);
        useCase = new CreateCompanyForUserUseCase(
            userRepositoryMock,
            companyRepositoryMock,
            createCompanyUseCase
        );
    });

    afterEach(() => {
        sinon.restore();
    });

    it("should create company and assign it to user", async () => {
        const userId = 1;
        const company = {
            name: faker.company.name(),
            document: faker.string.numeric(14),
            email: faker.internet.email(),
            phone: faker.phone.number(),
        };

        userRepositoryMock.getUserById.resolves({ id: userId, company_id: 0 });

        companyRepositoryMock.getByEmail
            .onCall(0)
            .resolves(null)
            .onCall(1)
            .resolves({ id: 10, ...company, status: true });

        companyRepositoryMock.create.resolves([10]);

        const result = await useCase.execute({ userId, company });

        expect(result).to.have.property("id", 10);
        expect(userRepositoryMock.updateCompanyId.calledWith(userId, 10)).to.be.true;
    });

    it("should throw if user id is invalid", async () => {
        try {
            await useCase.execute({ userId: 0, company: {} as any });
            throw new Error("should have thrown");
        } catch (error: any) {
            expect(error.message).to.equal(ErrorMessages.USER_ID_REQUIRED);
        }

        expect(userRepositoryMock.getUserById.called).to.be.false;
    });

    it("should throw if user is not found", async () => {
        userRepositoryMock.getUserById.resolves(null);

        try {
            await useCase.execute({ userId: 1, company: {} as any });
            throw new Error("should have thrown");
        } catch (error: any) {
            expect(error.message).to.equal(ErrorMessages.USER_NOT_FOUND);
        }

        expect(companyRepositoryMock.create.called).to.be.false;
        expect(userRepositoryMock.updateCompanyId.called).to.be.false;
    });

    it("should throw if user already has a company", async () => {
        userRepositoryMock.getUserById.resolves({ id: 1, company_id: 20 });

        try {
            await useCase.execute({ userId: 1, company: {} as any });
            throw new Error("should have thrown");
        } catch (error: any) {
            expect(error.message).to.equal(ErrorMessages.USER_COMPANY_ALREADY_SET);
        }

        expect(companyRepositoryMock.create.called).to.be.false;
        expect(userRepositoryMock.updateCompanyId.called).to.be.false;
    });

    it("should link existing company to user when company already exists and user has no company", async () => {
        const userId = 1;
        const company = {
            name: faker.company.name(),
            document: faker.string.numeric(14),
            email: faker.internet.email(),
            phone: faker.phone.number(),
        };

        userRepositoryMock.getUserById.resolves({ id: userId, company_id: 0 });
        companyRepositoryMock.getByEmail.resolves({ id: 99, ...company, status: true });

        const result = await useCase.execute({ userId, company });

        expect(result).to.have.property("id", 99);
        expect(companyRepositoryMock.create.called).to.be.false;
        expect(userRepositoryMock.updateCompanyId.calledWith(userId, 99)).to.be.true;
    });

    it("should throw if created company cannot be retrieved", async () => {
        const userId = 1;
        const company = {
            name: faker.company.name(),
            document: faker.string.numeric(14),
            email: faker.internet.email(),
            phone: faker.phone.number(),
        };

        userRepositoryMock.getUserById.resolves({ id: userId, company_id: 0 });

        companyRepositoryMock.getByEmail
            .onCall(0)
            .resolves(null)
            .onCall(1)
            .resolves(null);

        companyRepositoryMock.create.resolves([10]);

        try {
            await useCase.execute({ userId, company });
            throw new Error("should have thrown");
        } catch (error: any) {
            expect(error.message).to.equal(ErrorMessages.COMPANY_NOT_FOUND);
        }

        expect(userRepositoryMock.updateCompanyId.called).to.be.false;
    });
});
