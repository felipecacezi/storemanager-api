import { expect } from "chai";
import { afterEach, beforeEach, describe, it } from "node:test";
import { fakerPT_BR as faker } from '@faker-js/faker';
import { ForgotPasswordUseCase } from './forgot-password.js'
import sinon from "sinon";
import { CryptoPasswordGenerator } from "../../../infra/utils/crypto-password-generator.adapter.js";
import { UpdateUserUseCase } from "./update-user.js";

describe('Forgot password use cases tests', () => {
    let forgotPasswordUseCase: ForgotPasswordUseCase;
    let knexUserRepository: any;
    let sendMailUseCase: any;
    let cryptoPasswordGenerator: any;
    let updateUserUseCase: any;

    beforeEach(() => {
        knexUserRepository = {
            getUserByEmail: sinon.stub(),
        };
        sendMailUseCase = {
            execute: sinon.stub(),
        };
        cryptoPasswordGenerator = {
            generate: sinon.stub(),
        };
        updateUserUseCase = {
            execute: sinon.stub(),
        };
        forgotPasswordUseCase = new ForgotPasswordUseCase(
            knexUserRepository,
            sendMailUseCase,
            cryptoPasswordGenerator,
            updateUserUseCase
        );
    });

    afterEach(() => {
        sinon.restore();
    });

    it('email not found', async () => {
        const email = 'pirilampo@mundodalua.com';
        try {
            const result = await forgotPasswordUseCase.execute(email);
        } catch (error) {
            expect(error).to.have.property('message', 'O e-mail informado não foi encontrado (cod.: 400017)');
        }

    });

    it('invalid email', async () => {
        const email = 'emailinvalido';
        try {
            const result = await forgotPasswordUseCase.execute(email);
        } catch (error) {
            expect(error).to.have.property('message', 'O e-mail informado é inválido (cod.: 400013)');
        }
    });

    it('reset password link has been sent', async () => {
        const tempPassword = 'abc123temppass';
        const user = {
            id: faker.string.uuid(),
            email: faker.internet.email(),
            name: faker.person.fullName(),
            password: faker.internet.password()
        };
        knexUserRepository.getUserByEmail.resolves(user);
        cryptoPasswordGenerator.generate.returns(tempPassword);
        updateUserUseCase.execute.resolves();
        sendMailUseCase.execute.resolves();
        const result = await forgotPasswordUseCase.execute(user.email);
        expect(result).to.have.property('message', 'Email enviado com sucesso');
        expect(sendMailUseCase.execute.calledOnce).to.be.true;
        expect(updateUserUseCase.execute.calledOnce).to.be.true;
    })
});
