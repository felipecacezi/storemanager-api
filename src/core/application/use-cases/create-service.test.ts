import { expect } from "chai";
import { afterEach, beforeEach, describe, it } from "node:test";
import { fakerPT_BR as faker } from '@faker-js/faker';
import { CreateServiceUseCase } from './create-service.js';
import sinon from "sinon";

describe('Create service cases tests', () => {
    let serviceRepositoryMock: any;
    let useCase: CreateServiceUseCase;

    const fakeService = () => ({
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        service_price: faker.number.int({ min: 100, max: 100000 }),
    });

    beforeEach(() => {
        serviceRepositoryMock = {
            getByName: sinon.stub(),
            create: sinon.stub()
        };

        useCase = new CreateServiceUseCase(serviceRepositoryMock);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('service successfully created', async () => {
        const service = fakeService();

        serviceRepositoryMock.getByName.resolves(null);
        serviceRepositoryMock.create.resolves({ id: 1, ...service });

        const result = await useCase.execute(service);

        expect(result).to.have.property('id', 1);
        expect(serviceRepositoryMock.create.calledOnce).to.be.true;
        expect(serviceRepositoryMock.getByName.calledWith(service.name)).to.be.true;
    });

    it('service already exists', async () => {
        const service = fakeService();

        serviceRepositoryMock.getByName.resolves({ id: 1, ...service });

        try {
            await useCase.execute(service);
        } catch (error: any) {
            expect(error.message).to.equal("Já existe um serviço cadastrado com este nome (cod.: 400060)");
        }

        expect(serviceRepositoryMock.create.called).to.be.false;
    });

    it('service name is required', async () => {
        const service = { ...fakeService(), name: '' };

        try {
            await useCase.execute(service);
        } catch (error: any) {
            expect(error.message).to.equal("O nome do serviço é obrigatório (cod.: 400058)");
        }

        expect(serviceRepositoryMock.create.called).to.be.false;
    });

    it('service_price is required', async () => {
        const service = { ...fakeService(), service_price: undefined };

        try {
            await useCase.execute(service as any);
        } catch (error: any) {
            expect(error.message).to.equal("O preço do serviço é obrigatório (cod.: 400059)");
        }

        expect(serviceRepositoryMock.create.called).to.be.false;
    });

    it('service_price must be integer', async () => {
        const service = { ...fakeService(), service_price: 10.5 };

        try {
            await useCase.execute(service);
        } catch (error: any) {
            expect(error.message).to.equal("O preço do serviço é obrigatório (cod.: 400059)");
        }

        expect(serviceRepositoryMock.create.called).to.be.false;
    });
});
