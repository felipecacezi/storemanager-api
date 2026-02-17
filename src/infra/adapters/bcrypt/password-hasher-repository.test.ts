import { expect } from "chai";
import { PasswordHasherRepository } from "./password-hasher-repository.js";
import { afterEach, beforeEach, describe, it } from "node:test";

describe("Password hasher repository tests", () => {
    let sut: PasswordHasherRepository;

    beforeEach(() => {
        sut = new PasswordHasherRepository();
    });

    describe("hash()", () => {
        it("should hash a password", async () => {
            const password = "minha_senha_segura";
            const hash = await sut.hash(password);

            expect(hash).to.be.a("string");
            expect(hash).to.not.equal(password);
            expect(hash.length).to.be.greaterThan(20);
        });

        it("should generate different hashes for the same password", async () => {
            const password = "senha";
            const hash1 = await sut.hash(password);
            const hash2 = await sut.hash(password);

            expect(hash1).to.not.equal(hash2);
        });
    });

    describe("compare()", () => {
        it("should return true when the password is correct", async () => {
            const password = "123456_password";
            const hash = await sut.hash(password);

            const result = await sut.compare(password, hash);
            expect(result).to.be.true;
        });

        it("should return false when the password is incorrect", async () => {
            const password = "senha_correta";
            const senhaErrada = "senha_errada";
            const hash = await sut.hash(password);

            const result = await sut.compare(senhaErrada, hash);
            expect(result).to.be.false;
        });
    });
});