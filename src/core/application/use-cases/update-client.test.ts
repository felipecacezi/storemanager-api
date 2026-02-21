import { expect } from "chai";
import { afterEach, beforeEach, describe, it } from "node:test";
import { fakerPT_BR as faker } from '@faker-js/faker';
import { UpdateClientUseCase } from './update-client.js';
import sinon from "sinon";

describe('Update client cases tests', () => {
    let clientRepositoryMock: any;
    let useCase: UpdateClientUseCase;

    beforeEach(() => {
        clientRepositoryMock = {
            getById: sinon.stub(),
            update: sinon.stub()
        };

        useCase = new UpdateClientUseCase(clientRepositoryMock);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('client successfully updated', async () => {
        const fakeClient = {
            id: 1,
            name: faker.person.fullName(),
            email: faker.internet.email(),
        };

        clientRepositoryMock.getById.resolves(fakeClient);
        clientRepositoryMock.update.resolves(fakeClient);

        const result = await useCase.execute(fakeClient);

        expect(result).to.have.property('id', 1);
        expect(clientRepositoryMock.getById.calledWith(fakeClient.id)).to.be.true;
        expect(clientRepositoryMock.update.calledOnce).to.be.true;
    });

    it('client not found', async () => {
        const fakeClient = {
            id: 999,
            name: faker.person.fullName(),
        };

        clientRepositoryMock.getById.resolves(null);

        try {
            await useCase.execute(fakeClient);
        } catch (error: any) {
            expect(error.message).to.equal("Cliente não encontrado (cod.: 400023)");
        }

        expect(clientRepositoryMock.update.called).to.be.false;
        expect(clientRepositoryMock.getById.calledWith(fakeClient.id)).to.be.true;
    });

    it('client id is required', async () => {
        const fakeClient = {
            name: faker.person.fullName(),
        };

        try {
            await useCase.execute(fakeClient as any);
        } catch (error: any) {
            expect(error.message).to.equal("O id do cliente é obrigatório (cod.: 400024)");
        }

        expect(clientRepositoryMock.update.called).to.be.false;
        expect(clientRepositoryMock.getById.called).to.be.false;
    });
});
