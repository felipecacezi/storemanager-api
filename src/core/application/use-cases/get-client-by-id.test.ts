import { expect } from "chai";
import { afterEach, beforeEach, describe, it } from "node:test";
import { fakerPT_BR as faker } from "@faker-js/faker";
import sinon from "sinon";
import { GetClientByIdUseCase } from "./get-client-by-id.js";

describe("Get client by id cases tests", () => {
    let clientRepositoryMock: any;
    let useCase: GetClientByIdUseCase;

    beforeEach(() => {
        clientRepositoryMock = {
            getById: sinon.stub(),
        };

        useCase = new GetClientByIdUseCase(clientRepositoryMock);
    });

    afterEach(() => {
        sinon.restore();
    });

    it("should return a client by id", async () => {
        const client = {
            id: faker.number.int(),
            company_id: 1,
            name: faker.person.fullName(),
            email: faker.internet.email(),
            document: faker.string.numeric(11),
            phone: faker.phone.number(),
        };

        clientRepositoryMock.getById.resolves(client);

        const result = await useCase.execute({ id: client.id, company_id: client.company_id });

        expect(result).to.have.property("id", client.id);
        expect(clientRepositoryMock.getById.calledWith(client.id, client.company_id)).to.be.true;
    });

    it("should throw an error if client is not found", async () => {
        clientRepositoryMock.getById.resolves(null);

        try {
            await useCase.execute({ id: 999, company_id: 1 });
        } catch (error: any) {
            expect(error.message).to.equal("Cliente não encontrado (cod.: 400023)");
        }
    });

    it("should throw an error if id is not provided", async () => {
        clientRepositoryMock.getById.resolves(null);

        try {
            await useCase.execute({ company_id: 1 } as any);
        } catch (error: any) {
            expect(error.message).to.equal("O id do cliente é obrigatório (cod.: 400024)");
        }

        expect(clientRepositoryMock.getById.called).to.be.false;
    });
});
