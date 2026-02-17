import { expect } from "chai";
import { afterEach, beforeEach, describe, it } from "node:test";
import { fakerPT_BR as faker } from '@faker-js/faker';
import { UpdateUserUseCase } from './update-user.js'
import sinon from "sinon";

describe('Update user cases tests', () => {
    let userRepositoryMock: any;
    let useCase: UpdateUserUseCase;

    beforeEach(() => {
        userRepositoryMock = {
            getUserById: sinon.stub(),
            update: sinon.stub()
        };

        useCase = new UpdateUserUseCase(
            userRepositoryMock
        );
    });

    afterEach(() => {
        sinon.restore();
    });

    it('user successfully updated', async () => {
        let fakeUser = {
            id: 1,
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password()
        }

        userRepositoryMock.getUserById.resolves(fakeUser);
        userRepositoryMock.update.resolves(fakeUser);

        const result = await useCase.execute(fakeUser);

        expect(result).to.have.property('id', 1);
        expect(userRepositoryMock.getUserById.calledWith(fakeUser.id)).to.be.true;
        expect(userRepositoryMock.update.calledOnce).to.be.true;
    })

    it('user not found', async () => {
        let fakeUser = {
            id: 1,
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password()
        }

        userRepositoryMock.getUserById.resolves(null);
        userRepositoryMock.update.resolves(null);

        try {
            const result = await useCase.execute(fakeUser);
        } catch (error: any) {
            expect(error.message).to.equal("Usuário não encontrado (cod.: 400015)");
        }

        expect(userRepositoryMock.update.called).to.be.false;
        expect(userRepositoryMock.getUserById.calledWith(fakeUser.id)).to.be.true;
    })

    it('user id is required', async () => {
        let fakeUser = {
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password()
        }

        userRepositoryMock.getUserById.resolves(null);
        userRepositoryMock.update.resolves(null);

        try {
            const result = await useCase.execute(fakeUser);
        } catch (error: any) {
            expect(error.message).to.equal("O id do usuário é obrigatório (cod.: 400016)");
        }

        expect(userRepositoryMock.update.called).to.be.false;
        expect(userRepositoryMock.getUserById.called).to.be.false;
    })
});