import { expect } from "chai";
import { afterEach, beforeEach, describe, it } from "node:test";
import { fakerPT_BR as faker } from '@faker-js/faker';
import { DeleteServiceOrderUseCase } from './delete-service-order.js';
import sinon from "sinon";

describe('Delete service order cases tests', () => {
    let deleteServiceOrderUseCase: DeleteServiceOrderUseCase;
    let serviceOrderRepository: any;

    beforeEach(() => {
        serviceOrderRepository = {
            update: sinon.stub(),
            getById: sinon.stub(),
        };
        deleteServiceOrderUseCase = new DeleteServiceOrderUseCase(serviceOrderRepository);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should delete a service order', async () => {
        const id = faker.number.int();
        serviceOrderRepository.getById.resolves({ id });
        serviceOrderRepository.update.resolves({ id, status: false });
        const result = await deleteServiceOrderUseCase.execute({ id });
        expect(result).to.be.an('object');
    });

    it('should throw an error if service order is not found', async () => {
        serviceOrderRepository.getById.resolves(null);
        try {
            await deleteServiceOrderUseCase.execute({ id: 999 });
        } catch (error: any) {
            expect(error.message).to.equal("Ordem de serviço não encontrada (cod.: 400075)");
        }
        expect(serviceOrderRepository.update.called).to.be.false;
    });

    it('should throw an error if service order id is not provided', async () => {
        try {
            await deleteServiceOrderUseCase.execute({ id: null as any });
        } catch (error: any) {
            expect(error.message).to.equal("O id da ordem de serviço é obrigatório (cod.: 400076)");
        }
        expect(serviceOrderRepository.update.called).to.be.false;
    });
});
