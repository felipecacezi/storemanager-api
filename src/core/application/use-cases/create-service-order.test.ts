import { expect } from "chai";
import { afterEach, beforeEach, describe, it } from "node:test";
import { fakerPT_BR as faker } from '@faker-js/faker';
import { CreateServiceOrderUseCase } from './create-service-order.js';
import sinon from "sinon";

describe('Create service order cases tests', () => {
    let serviceOrderRepositoryMock: any;
    let clientRepositoryMock: any;
    let serviceRepositoryMock: any;
    let productRepositoryMock: any;
    let useCase: CreateServiceOrderUseCase;

    const fakeServiceOrder = () => ({
        client_id: 1,
        description: faker.lorem.sentence(),
        service_id: 1,
        product_id: 1,
        service_status: 'pendente',
    });

    beforeEach(() => {
        serviceOrderRepositoryMock = { create: sinon.stub() };
        clientRepositoryMock = { getById: sinon.stub() };
        serviceRepositoryMock = { getById: sinon.stub() };
        productRepositoryMock = { getById: sinon.stub() };

        useCase = new CreateServiceOrderUseCase(
            serviceOrderRepositoryMock,
            clientRepositoryMock,
            serviceRepositoryMock,
            productRepositoryMock
        );
    });

    afterEach(() => {
        sinon.restore();
    });

    it('service order successfully created', async () => {
        const serviceOrder = fakeServiceOrder();

        clientRepositoryMock.getById.resolves({ id: serviceOrder.client_id });
        serviceRepositoryMock.getById.resolves({ id: serviceOrder.service_id });
        productRepositoryMock.getById.resolves({ id: serviceOrder.product_id });
        serviceOrderRepositoryMock.create.resolves({ id: 1, ...serviceOrder });

        const result = await useCase.execute(serviceOrder as any);

        expect(result).to.have.property('id', 1);
        expect(serviceOrderRepositoryMock.create.calledOnce).to.be.true;
    });

    it('client_id is required', async () => {
        const serviceOrder = { ...fakeServiceOrder(), client_id: undefined };
        try {
            await useCase.execute(serviceOrder as any);
        } catch (error: any) {
            expect(error.message).to.equal("O client_id da ordem de serviço é obrigatório (cod.: 400069)");
        }
        expect(serviceOrderRepositoryMock.create.called).to.be.false;
    });

    it('service_status is invalid', async () => {
        const serviceOrder = { ...fakeServiceOrder(), service_status: 'abc' };
        try {
            await useCase.execute(serviceOrder as any);
        } catch (error: any) {
            expect(error.message).to.equal("O status do serviço é inválido (cod.: 400074)");
        }
        expect(serviceOrderRepositoryMock.create.called).to.be.false;
    });

    it('client not found', async () => {
        const serviceOrder = fakeServiceOrder();
        clientRepositoryMock.getById.resolves(null);
        try {
            await useCase.execute(serviceOrder as any);
        } catch (error: any) {
            expect(error.message).to.equal("Cliente não encontrado (cod.: 400023)");
        }
        expect(serviceOrderRepositoryMock.create.called).to.be.false;
    });

    it('service not found', async () => {
        const serviceOrder = fakeServiceOrder();
        clientRepositoryMock.getById.resolves({ id: serviceOrder.client_id });
        serviceRepositoryMock.getById.resolves(null);
        try {
            await useCase.execute(serviceOrder as any);
        } catch (error: any) {
            expect(error.message).to.equal("Serviço não encontrado (cod.: 400061)");
        }
        expect(serviceOrderRepositoryMock.create.called).to.be.false;
    });

    it('product not found', async () => {
        const serviceOrder = fakeServiceOrder();
        clientRepositoryMock.getById.resolves({ id: serviceOrder.client_id });
        serviceRepositoryMock.getById.resolves({ id: serviceOrder.service_id });
        productRepositoryMock.getById.resolves(null);
        try {
            await useCase.execute(serviceOrder as any);
        } catch (error: any) {
            expect(error.message).to.equal("Produto não encontrado (cod.: 400050)");
        }
        expect(serviceOrderRepositoryMock.create.called).to.be.false;
    });
});
