import { expect } from "chai";
import { afterEach, beforeEach, describe, it } from "node:test";
import { fakerPT_BR as faker } from '@faker-js/faker';
import { UpdateServiceOrderUseCase } from './update-service-order.js';
import sinon from "sinon";

describe('Update service order cases tests', () => {
    let serviceOrderRepositoryMock: any;
    let useCase: UpdateServiceOrderUseCase;

    beforeEach(() => {
        serviceOrderRepositoryMock = {
            getById: sinon.stub(),
            update: sinon.stub()
        };

        useCase = new UpdateServiceOrderUseCase(serviceOrderRepositoryMock);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('service order successfully updated', async () => {
        const fakeServiceOrder = {
            id: 1,
            description: faker.lorem.sentence(),
            service_status: 'em_andamento',
        };

        serviceOrderRepositoryMock.getById.resolves(fakeServiceOrder);
        serviceOrderRepositoryMock.update.resolves(fakeServiceOrder);

        const result = await useCase.execute(fakeServiceOrder as any);

        expect(result).to.have.property('id', 1);
        expect(serviceOrderRepositoryMock.update.calledOnce).to.be.true;
    });

    it('service order not found', async () => {
        serviceOrderRepositoryMock.getById.resolves(null);
        try {
            await useCase.execute({ id: 999 } as any);
        } catch (error: any) {
            expect(error.message).to.equal("Ordem de serviço não encontrada (cod.: 400075)");
        }
        expect(serviceOrderRepositoryMock.update.called).to.be.false;
    });

    it('service order id is required', async () => {
        try {
            await useCase.execute({} as any);
        } catch (error: any) {
            expect(error.message).to.equal("O id da ordem de serviço é obrigatório (cod.: 400076)");
        }
        expect(serviceOrderRepositoryMock.update.called).to.be.false;
    });
});
