import { expect } from "chai";
import { afterEach, beforeEach, describe, it } from "node:test";
import { fakerPT_BR as faker } from '@faker-js/faker';
import { DeleteClientUseCase } from './delete-client.js';
import sinon from "sinon";
import { KnexClientRepository } from "../../../infra/adapters/knex/client-repository.js";
import { GetAllClientsUseCase } from "./get-all-clients.js";

describe('Get all clients cases tests', () => {
    let clientRepository: any;
    let getAllClientsUseCase: GetAllClientsUseCase;

    beforeEach(() => {
        clientRepository = {
            getAll: sinon.stub(),
        }
        getAllClientsUseCase = new GetAllClientsUseCase(clientRepository);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should return all clients', async () => {
        clientRepository.getAll.resolves([
            {
                id: faker.string.uuid(),
                name: faker.person.fullName(),
                email: faker.internet.email(),
                phone: faker.string.numeric(11),
                createdAt: faker.date.recent(),
                updatedAt: faker.date.recent(),
            },
            {
                id: faker.string.uuid(),
                name: faker.person.fullName(),
                email: faker.internet.email(),
                phone: faker.string.numeric(11),
                createdAt: faker.date.recent(),
                updatedAt: faker.date.recent(),
            },
            {
                id: faker.string.uuid(),
                name: faker.person.fullName(),
                email: faker.internet.email(),
                phone: faker.string.numeric(11),
                createdAt: faker.date.recent(),
                updatedAt: faker.date.recent(),
            },
        ]);
        const clients = await getAllClientsUseCase.execute({ page: 1, limit: 10 });
        expect(clients).to.be.an('array');
        expect(clients).to.have.lengthOf(3);
    });

    it('should throw an error if page is not provided', async () => {
        try {
            await getAllClientsUseCase.execute({ page: 0, limit: 10 });
        } catch (error) {
            expect(error).to.be.an('error');
            expect(error).to.have.property('message', 'A página é obrigatória (cod.: 400026)');
        }
    });

    it('should throw an error if limit is not provided', async () => {
        try {
            await getAllClientsUseCase.execute({ page: 1, limit: 0 });
        } catch (error) {
            expect(error).to.be.an('error');
            expect(error).to.have.property('message', 'O limite é obrigatório (cod.: 400028)');
        }
    });
});