import { expect } from "chai";
import { afterEach, beforeEach, describe, it } from "node:test";
import { fakerPT_BR as faker } from "@faker-js/faker";
import sinon from "sinon";
import { UpdateUserTokenUseCase } from "./update-user-token.js";

describe("Update user token use case tests", () => {
    let userRepositoryMock: any;
    let useCase: UpdateUserTokenUseCase;

    beforeEach(() => {
        userRepositoryMock = {
            getUserById: sinon.stub(),
            update: sinon.stub()
        };

        useCase = new UpdateUserTokenUseCase(
            userRepositoryMock
        );
    });

    afterEach(() => {
        sinon.restore();
    });

    it("should update user token successfully", async () => {
        const fakeUser = {
            id: faker.number.int({ min: 1 }),
            token: faker.string.uuid()
        };

        userRepositoryMock.getUserById.resolves({ id: fakeUser.id });
        userRepositoryMock.update.resolves({ ...fakeUser });

        const result = await useCase.execute(fakeUser as any);

        expect(result).to.deep.equal(fakeUser);
        expect(userRepositoryMock.getUserById.calledWith(fakeUser.id)).to.be.true;
        expect(userRepositoryMock.update.calledOnce).to.be.true;
        expect(userRepositoryMock.update.firstCall.args[0]).to.deep.equal(fakeUser);
    });

    it("should throw error when user id is missing", async () => {
        const fakeUser = { token: faker.string.uuid() };

        try {
            await useCase.execute(fakeUser as any);
            expect.fail("Expected error was not thrown");
        } catch (error: any) {
            expect(error.message).to.equal("O id do usuário é obrigatório (cod.: 400016)");
        }

        expect(userRepositoryMock.getUserById.called).to.be.false;
        expect(userRepositoryMock.update.called).to.be.false;
    });

    it("should throw error when user is not found", async () => {
        const fakeUser = {
            id: faker.number.int({ min: 1 }),
            token: faker.string.uuid()
        };

        userRepositoryMock.getUserById.resolves(null);

        try {
            await useCase.execute(fakeUser as any);
            expect.fail("Expected error was not thrown");
        } catch (error: any) {
            expect(error.message).to.equal("Usuário não encontrado (cod.: 400015)");
        }

        expect(userRepositoryMock.getUserById.calledWith(fakeUser.id)).to.be.true;
        expect(userRepositoryMock.update.called).to.be.false;
    });
});