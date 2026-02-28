import { expect } from "chai";
import { afterEach, beforeEach, describe, it } from "node:test";
import { fakerPT_BR as faker } from '@faker-js/faker';
import { UpdateUserUseCase } from './update-user.js'
import sinon from "sinon";

describe('Update user cases tests', () => {
    let userRepositoryMock: any;
    let passwordHasherMock: any;
    let useCase: UpdateUserUseCase;

    beforeEach(() => {
        userRepositoryMock = {
            getUserById: sinon.stub(),
            update: sinon.stub()
        };
        passwordHasherMock = {
            hash: sinon.stub().resolves('hashed_password'),
            compare: sinon.stub()
        };

        useCase = new UpdateUserUseCase(
            userRepositoryMock,
            passwordHasherMock
        );
    });

    afterEach(() => {
        sinon.restore();
    });

    it('user successfully updated', async () => {
        const fakeUser = {
            id: 1,
            email: faker.internet.email(),
            password: faker.internet.password(),
            confirm_password: faker.internet.password()
        };
        fakeUser.confirm_password = fakeUser.password;

        userRepositoryMock.getUserById.resolves(fakeUser);
        userRepositoryMock.update.resolves(fakeUser);

        const result = await useCase.execute(fakeUser);

        expect(result).to.have.property('id', 1);
        expect(userRepositoryMock.getUserById.calledWith(fakeUser.id)).to.be.true;
        expect(userRepositoryMock.update.calledOnce).to.be.true;
    });

    it('user not found', async () => {
        const fakeUser = {
            id: 1,
            email: faker.internet.email(),
            password: faker.internet.password()
        };

        userRepositoryMock.getUserById.resolves(null);
        // userRepositoryMock.update.resolves(null);

        try {
            await useCase.execute(fakeUser as any);
        } catch (error: any) {
            expect(error.message).to.equal("Usuário não encontrado (cod.: 400015)");
        }

        expect(userRepositoryMock.update.called).to.be.false;
        expect(userRepositoryMock.getUserById.calledWith(fakeUser.id)).to.be.true;
    });

    it('user id is required', async () => {
        const fakeUser = {
            email: faker.internet.email(),
            password: faker.internet.password()
        };

        userRepositoryMock.getUserById.resolves(null);
        userRepositoryMock.update.resolves(null);

        try {
            await useCase.execute(fakeUser as any);
        } catch (error: any) {
            expect(error.message).to.equal("O id do usuário é obrigatório (cod.: 400016)");
        }

        expect(userRepositoryMock.update.called).to.be.false;
        expect(userRepositoryMock.getUserById.called).to.be.false;
    });

    it('confirm password is required when password is provided', async () => {
        const fakeUser = {
            id: 1,
            email: faker.internet.email(),
            password: faker.internet.password()
        };

        userRepositoryMock.getUserById.resolves({ id: 1 });

        try {
            await useCase.execute(fakeUser as any);
        } catch (error: any) {
            expect(error.message).to.equal("A confirmação de senha é obrigatória (cod.: 400101)");
        }

        expect(userRepositoryMock.update.called).to.be.false;
    });

    it('should throw error when password and confirm password do not match', async () => {
        const fakeUser = {
            id: 1,
            email: faker.internet.email(),
            password: faker.internet.password(),
            confirm_password: faker.internet.password()
        };

        userRepositoryMock.getUserById.resolves({ id: 1 });

        try {
            await useCase.execute(fakeUser as any);
        } catch (error: any) {
            expect(error.message).to.equal("Senha e confirmação de senha não coincidem (cod.: 400102)");
        }

        expect(userRepositoryMock.update.called).to.be.false;
    });
});
