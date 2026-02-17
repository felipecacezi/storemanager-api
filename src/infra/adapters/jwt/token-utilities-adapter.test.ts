import { expect } from "chai";
import sinon from "sinon";
import { CreateJwtTokenRepository } from "./token-utilities-adapter.js";
import type { FastifyInstance } from "fastify";
import { afterEach, beforeEach, describe, it } from "node:test";

describe("CreateJwtTokenRepository", () => {
    let createJwtTokenRepository: CreateJwtTokenRepository;
    let fastifyMock: any;

    beforeEach(() => {
        fastifyMock = {
            jwt: {
                sign: sinon.stub()
            }
        };

        createJwtTokenRepository = new CreateJwtTokenRepository(fastifyMock as FastifyInstance);
    });

    afterEach(() => {
        sinon.restore();
    });

    describe("generateToken()", () => {
        it("should generate a token", async () => {
            const payload = { id: "123", role: "admin" };
            const tokenFake = "token_gerado_fake";

            fastifyMock.jwt.sign.returns(tokenFake);

            const result = await createJwtTokenRepository.generateToken(payload);

            expect(fastifyMock.jwt.sign.calledOnceWith(payload, { expiresIn: "1d" })).to.be.true;
            expect(result).to.equal(tokenFake);
        });

        it("should throw an error if fastify.jwt.sign fails", async () => {
            fastifyMock.jwt.sign.throws(new Error("Erro ao assinar"));

            try {
                await createJwtTokenRepository.generateToken({ id: 1 });
                expect.fail("Should have thrown an error");
            } catch (error: any) {
                expect(error.message).to.equal("Erro ao assinar");
            }
        });
    });
});