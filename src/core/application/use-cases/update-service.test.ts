import { expect } from "chai";
import { afterEach, beforeEach, describe, it } from "node:test";
import { fakerPT_BR as faker } from '@faker-js/faker';
import { UpdateServiceUseCase } from './update-service.js';
import sinon from "sinon";

describe('Update service cases tests', () => {
    let serviceRepositoryMock: any;
    let useCase: UpdateServiceUseCase;

    beforeEach(() => {
        serviceRepositoryMock = {
            getById: sinon.stub(),
            update: sinon.stub()
        };

        useCase = new UpdateServiceUseCase(serviceRepositoryMock);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('service successfully updated', async () => {
        const fakeService = {
            id: 1,
            name: faker.commerce.productName(),
            service_price: faker.number.int({ min: 100, max: 100000 }),
        };

        serviceRepositoryMock.getById.resolves(fakeService);
        serviceRepositoryMock.update.resolves(fakeService);

        const result = await useCase.execute(fakeService);

        expect(result).to.have.property('id', 1);
        expect(serviceRepositoryMock.getById.calledWith(fakeService.id)).to.be.true;
        expect(serviceRepositoryMock.update.calledOnce).to.be.true;
    });

    it('service not found', async () => {
        const fakeService = {
            id: 999,
            name: faker.commerce.productName(),
        };

        serviceRepositoryMock.getById.resolves(null);

        try {
            await useCase.execute(fakeService);
        } catch (error: any) {
            expect(error.message).to.equal("Serviço não encontrado (cod.: 400061)");
        }

        expect(serviceRepositoryMock.update.called).to.be.false;
        expect(serviceRepositoryMock.getById.calledWith(fakeService.id)).to.be.true;
    });

    it('service id is required', async () => {
        const fakeService = {
            name: faker.commerce.productName(),
        };

        try {
            await useCase.execute(fakeService as any);
        } catch (error: any) {
            expect(error.message).to.equal("O id do serviço é obrigatório (cod.: 400062)");
        }

        expect(serviceRepositoryMock.update.called).to.be.false;
        expect(serviceRepositoryMock.getById.called).to.be.false;
    });
});
