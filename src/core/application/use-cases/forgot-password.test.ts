import { expect } from "chai";
import { afterEach, beforeEach, describe, it } from "node:test";
import { fakerPT_BR as faker } from '@faker-js/faker';
import { ForgotPasswordUseCase } from './forgot-password.js'
import sinon from "sinon";

describe('Forgot password use cases tests', () => {
    let forgotPasswordUseCase: ForgotPasswordUseCase;
    let knexUserRepository: any;
    let sendMailUseCase: any;

    beforeEach(() => {
        knexUserRepository = {
            getUserByEmail: sinon.stub(),
        };
        sendMailUseCase = {
            execute: sinon.stub(),
        };
        forgotPasswordUseCase = new ForgotPasswordUseCase(
            knexUserRepository,
            sendMailUseCase
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
        const user = {
            id: faker.string.uuid(),
            email: faker.internet.email(),
            name: faker.person.fullName(),
            password: faker.internet.password(),
            role: 'admin',
            created_at: new Date(),
            updated_at: new Date(),
        };
        knexUserRepository.getUserByEmail.resolves(user);
        sendMailUseCase.execute.resolves();
        const result = await forgotPasswordUseCase.execute(user.email);
        expect(result).to.have.property('message', 'Email enviado com sucesso');
        expect(sendMailUseCase.execute.calledOnce).to.be.true;
        expect(sendMailUseCase.execute.calledWith(
            user.email,
            'Recuperação de senha',
            `<h1>Recuperação de senha</h1>
            <p>Clique no link abaixo para recuperar sua senha</p>
            <a href="http://localhost:3000/reset-password/${user.id}">Recuperar senha</a>`
        )).to.be.true;
    })
});
