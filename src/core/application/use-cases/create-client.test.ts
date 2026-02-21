import { expect } from "chai";
import { afterEach, beforeEach, describe, it } from "node:test";
import { fakerPT_BR as faker } from '@faker-js/faker';
import { CreateClientUseCase } from './create-client.js';
import sinon from "sinon";

describe('Create client cases tests', () => {
    let clientRepositoryMock: any;
    let useCase: CreateClientUseCase;

    const fakeClient = () => ({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        document: faker.string.numeric(11),
        phone: faker.phone.number(),
    });

    beforeEach(() => {
        clientRepositoryMock = {
            getByEmail: sinon.stub(),
            create: sinon.stub()
        };

        useCase = new CreateClientUseCase(clientRepositoryMock);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('client successfully created', async () => {
        const client = fakeClient();

        clientRepositoryMock.getByEmail.resolves(null);
        clientRepositoryMock.create.resolves({ id: 1, ...client });

        const result = await useCase.execute(client);

        expect(result).to.have.property('id', 1);
        expect(clientRepositoryMock.create.calledOnce).to.be.true;
        expect(clientRepositoryMock.getByEmail.calledWith(client.email)).to.be.true;
    });

    it('client already exists', async () => {
        const client = fakeClient();

        clientRepositoryMock.getByEmail.resolves({ id: 1, ...client });

        try {
            await useCase.execute(client);
        } catch (error: any) {
            expect(error.message).to.equal("Já existe um cliente cadastrado com este e-mail (cod.: 400022)");
        }

        expect(clientRepositoryMock.create.called).to.be.false;
    });

    it('client name is required', async () => {
        const client = { ...fakeClient(), name: '' };

        try {
            await useCase.execute(client);
        } catch (error: any) {
            expect(error.message).to.equal("O nome do cliente é obrigatório (cod.: 400018)");
        }

        expect(clientRepositoryMock.create.called).to.be.false;
    });

    it('client email is required', async () => {
        const client = { ...fakeClient(), email: '' };

        try {
            await useCase.execute(client);
        } catch (error: any) {
            expect(error.message).to.equal("O e-mail do cliente é obrigatório (cod.: 400019)");
        }

        expect(clientRepositoryMock.create.called).to.be.false;
    });

    it('client email is invalid', async () => {
        const client = { ...fakeClient(), email: 'emailinvalido' };

        try {
            await useCase.execute(client);
        } catch (error: any) {
            expect(error.message).to.equal("O e-mail do cliente é inválido (cod.: 400020)");
        }

        expect(clientRepositoryMock.create.called).to.be.false;
    });

    it('client document is required', async () => {
        const client = { ...fakeClient(), document: '' };

        try {
            await useCase.execute(client);
        } catch (error: any) {
            expect(error.message).to.equal("O documento do cliente é obrigatório (cod.: 400021)");
        }

        expect(clientRepositoryMock.create.called).to.be.false;
    });

    it('client phone is required', async () => {
        const client = { ...fakeClient(), phone: '' };

        try {
            await useCase.execute(client);
        } catch (error: any) {
            expect(error.message).to.equal("O telefone do cliente é obrigatório (cod.: 400025)");
        }

        expect(clientRepositoryMock.create.called).to.be.false;
    });
});
