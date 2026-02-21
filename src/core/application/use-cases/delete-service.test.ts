import { expect } from "chai";
import { afterEach, beforeEach, describe, it } from "node:test";
import { fakerPT_BR as faker } from '@faker-js/faker';
import { DeleteServiceUseCase } from './delete-service.js';
import sinon from "sinon";

describe('Delete service cases tests', () => {
    let deleteServiceUseCase: DeleteServiceUseCase;
    let knexServiceRepository: any;

    beforeEach(() => {
        knexServiceRepository = {
            update: sinon.stub(),
            getById: sinon.stub(),
        };
        deleteServiceUseCase = new DeleteServiceUseCase(knexServiceRepository);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should delete a service', async () => {
        const serviceId = faker.number.int();
        const service = { id: serviceId };

        knexServiceRepository.getById.resolves({ id: serviceId });
        knexServiceRepository.update.resolves({ id: serviceId, status: false });

        const result = await deleteServiceUseCase.execute(service);
        expect(result).to.be.an('object');
    });

    it('should throw an error if service is not found', async () => {
        const serviceId = faker.number.int();
        const service = { id: serviceId };

        knexServiceRepository.getById.resolves(null);
        knexServiceRepository.update.resolves({ id: serviceId, status: false });

        try {
            await deleteServiceUseCase.execute(service);
        } catch (error: any) {
            expect(error.message).to.equal("Serviço não encontrado (cod.: 400061)");
        }

        expect(knexServiceRepository.update.called).to.be.false;
    });

    it('should throw an error if service id is not provided', async () => {
        const service = { id: null };

        knexServiceRepository.getById.resolves(null);
        knexServiceRepository.update.resolves({ id: null, status: false });

        try {
            await deleteServiceUseCase.execute(service as any);
        } catch (error: any) {
            expect(error.message).to.equal("O id do serviço é obrigatório (cod.: 400062)");
        }

        expect(knexServiceRepository.update.called).to.be.false;
    });
});
