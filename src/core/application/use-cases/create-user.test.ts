import { expect } from "chai";
import { afterEach, beforeEach, describe, it } from "node:test";
import { fakerPT_BR as faker } from '@faker-js/faker';
import { CreateUserUseCase } from './create-user.js'
import sinon from "sinon";

describe('Create user cases tests', () => {
    let userRepositoryMock: any;
    let passwordHasherMock: any;
    let useCase: CreateUserUseCase;

    beforeEach(() => {
        userRepositoryMock = {
            getUserByEmail: sinon.stub(),
            create: sinon.stub()
        };

        passwordHasherMock = {
            hash: sinon.stub()
        };

        useCase = new CreateUserUseCase(
            userRepositoryMock,
            passwordHasherMock
        );
    });

    afterEach(() => {
        sinon.restore();
    });

    it('user successfully created', async () => {
        let fakeNewUser = {
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password()
        }

        userRepositoryMock.getUserByEmail.resolves(null);
        userRepositoryMock.create.resolves({ id: 1, ...fakeNewUser });

        const result = await useCase.execute(fakeNewUser);

        expect(result).to.have.property('id', 1);
        expect(userRepositoryMock.create.calledOnce).to.be.true;
        expect(userRepositoryMock.getUserByEmail.calledWith(fakeNewUser.email)).to.be.true;
    })

    it('user already exists', async () => {
        let fakeNewUser = {
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password()
        }

        userRepositoryMock.getUserByEmail.resolves({ id: 1, ...fakeNewUser });
        userRepositoryMock.create.resolves({ id: 1, ...fakeNewUser });
        try {
            const result = await useCase.execute(fakeNewUser);
        } catch (error: any) {
            expect(error.message).to.equal("O e-mail informado já está cadastrado (cod.: 400002)");
        }

        expect(userRepositoryMock.create.called).to.be.false;
    })

    it('user password not provided', async () => {
        let fakeNewUser = {
            name: faker.person.fullName(),
            email: faker.internet.email()
        }

        userRepositoryMock.getUserByEmail.resolves(null);
        userRepositoryMock.create.resolves({ id: 1, ...fakeNewUser });
        try {
            const result = await useCase.execute(fakeNewUser);
        } catch (error: any) {
            expect(error.message).to.equal("A senha é obrigatória (cod.: 400007)");
        }

        expect(userRepositoryMock.create.called).to.be.false;
    })
})