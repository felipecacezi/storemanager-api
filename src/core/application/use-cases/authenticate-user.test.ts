import { expect } from "chai";
import { afterEach, beforeEach, describe, it } from "node:test";
import { fakerPT_BR as faker } from '@faker-js/faker';
import sinon from "sinon";
import { AuthenticateUserUseCase } from "./authenticate-user.js";
import { ErrorMessages } from "../../domain/erros/error-mesages.js";

describe('Authenticate user cases tests', () => {
    let authenticateUserUseCase: AuthenticateUserUseCase;
    let userRepositoryMock: any;
    let passwordHasherRepositoryMock: any;
    let updateUserUseCaseMock: any;
    let createJwtTokenRepositoryMock: any;

    beforeEach(() => {
        userRepositoryMock = {
            getUserByEmail: sinon.stub(),
            update: sinon.stub()
        };

        passwordHasherRepositoryMock = {
            compare: sinon.stub()
        };

        updateUserUseCaseMock = {
            execute: sinon.stub()
        };

        createJwtTokenRepositoryMock = {
            generateToken: sinon.stub()
        };

        authenticateUserUseCase = new AuthenticateUserUseCase(
            userRepositoryMock,
            passwordHasherRepositoryMock,
            updateUserUseCaseMock,
            createJwtTokenRepositoryMock
        );
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should authenticate a user successfully', async () => {
        const fakeUser = {
            id: 1,
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password()
        };

        userRepositoryMock.getUserByEmail.resolves(fakeUser);
        passwordHasherRepositoryMock.compare.resolves(true);
        updateUserUseCaseMock.execute.resolves(fakeUser);
        createJwtTokenRepositoryMock.generateToken.resolves('fake-token');

        const result = await authenticateUserUseCase.execute(fakeUser.email, fakeUser.password);

        expect(result).to.deep.equal({ ...fakeUser, token: 'fake-token' });
        expect(userRepositoryMock.getUserByEmail.calledWith(fakeUser.email)).to.be.true;
        expect(passwordHasherRepositoryMock.compare.calledWith(fakeUser.password, fakeUser.password)).to.be.true;
        expect(updateUserUseCaseMock.execute.calledWith({ ...fakeUser, token: 'fake-token' })).to.be.true;
        expect(createJwtTokenRepositoryMock.generateToken.calledWith({ email: fakeUser.email, id: fakeUser.id })).to.be.true;
    });

    it('should throw an error if user is not found', async () => {
        const fakeUser = {
            id: 1,
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password()
        };

        userRepositoryMock.getUserByEmail.resolves(null);

        try {
            await authenticateUserUseCase.execute(fakeUser.email, fakeUser.password);
        } catch (error: any) {
            expect(error.message).to.equal(`O e-mail ou senha informados estão incorretos (cod.: 401001)`);
        }

        expect(userRepositoryMock.getUserByEmail.calledWith(fakeUser.email)).to.be.true;
        expect(passwordHasherRepositoryMock.compare.called).to.be.false;
        expect(updateUserUseCaseMock.execute.called).to.be.false;
        expect(createJwtTokenRepositoryMock.generateToken.called).to.be.false;
    });

    it('should throw an error if password is not valid', async () => {
        const fakeUser = {
            id: 1,
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password()
        };

        userRepositoryMock.getUserByEmail.resolves(fakeUser);
        passwordHasherRepositoryMock.compare.resolves(false);

        try {
            await authenticateUserUseCase.execute(fakeUser.email, fakeUser.password);
        } catch (error: any) {
            expect(error.message).to.equal(`O e-mail ou senha informados estão incorretos (cod.: 401001)`);
        }

        expect(userRepositoryMock.getUserByEmail.calledWith(fakeUser.email)).to.be.true;
        expect(passwordHasherRepositoryMock.compare.calledWith(fakeUser.password, fakeUser.password)).to.be.true;
        expect(updateUserUseCaseMock.execute.called).to.be.false;
        expect(createJwtTokenRepositoryMock.generateToken.called).to.be.false;
    });
});