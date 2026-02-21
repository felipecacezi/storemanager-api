import { expect } from "chai";
import { afterEach, beforeEach, describe, it } from "node:test";
import { fakerPT_BR as faker } from '@faker-js/faker';
import { DeleteClientUseCase } from './delete-client.js';
import sinon from "sinon";

describe('Delete client cases tests', () => {
    let deleteClientUseCase: DeleteClientUseCase;
    let knexClientRepository: any;

    beforeEach(() => {
        knexClientRepository = {
            update: sinon.stub(),
            getById: sinon.stub(),
        };
        deleteClientUseCase = new DeleteClientUseCase(knexClientRepository);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should delete a client', async () => {
        const clientId = faker.number.int();
        const client = { id: clientId };

        knexClientRepository.getById.resolves({ id: clientId });
        knexClientRepository.update.resolves({ id: clientId, status: false });

        const result = await deleteClientUseCase.execute(client);
        expect(result).to.be.an('object');
    });

    it('should throw an error if client is not found', async () => {
        const clientId = faker.number.int();
        const client = { id: clientId };

        knexClientRepository.getById.resolves(null);
        knexClientRepository.update.resolves({ id: clientId, status: false });

        try {
            const result = await deleteClientUseCase.execute(client);
        } catch (error: any) {
            expect(error.message).to.equal("Cliente não encontrado (cod.: 400023)");
        }

        expect(knexClientRepository.update.called).to.be.false;
    });

    it('should throw an error if client id is not provided', async () => {
        const client = { id: null };

        knexClientRepository.getById.resolves(null);
        knexClientRepository.update.resolves({ id: null, status: false });

        try {
            const result = await deleteClientUseCase.execute(client);
        } catch (error: any) {
            expect(error.message).to.equal("O id do cliente é obrigatório (cod.: 400024)");
        }

        expect(knexClientRepository.update.called).to.be.false;
    });
});