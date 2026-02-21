import { z } from "zod";
import { ErroCodes } from "../../domain/enums/error-codes.js";
import { ErrorMessages } from "../../domain/erros/error-mesages.js";
import type { KnexUserRepository } from "../../../infra/adapters/knex/user-repository.js";
import { SendMailUseCase } from "./send-mail.js";
import { CryptoPasswordGenerator } from "../../../infra/utils/crypto-password-generator.adapter.js";
import { UpdateUserUseCase } from "../use-cases/update-user.js";
import dotenv from 'dotenv';
dotenv.config();

export class ForgotPasswordUseCase {
    constructor(
        private knexUserRepository: KnexUserRepository,
        private sendMailUseCase: SendMailUseCase,
        private cryptoPasswordGenerator: CryptoPasswordGenerator,
        private updateUserUseCase: UpdateUserUseCase
    ) { }

    async execute(email: string) {

        const emailSchema = z.string().email();
        const validatedEmail = emailSchema.safeParse(email);

        if (!validatedEmail.success) {
            throw new Error(ErrorMessages[ErroCodes.USER_EMAIL_INVALID]);
        }

        const user = await this.knexUserRepository.getUserByEmail(email);
        if (!user) {
            throw new Error(ErrorMessages[ErroCodes.USER_EMAIL_NOT_FOUND]);
        }

        const tempPassword = this.cryptoPasswordGenerator.generate({
            length: 12,
            includeNumbers: true,
            includeSymbols: false
        });

        const newPassUser = { ...user, password: String(tempPassword) };

        try {
            await this.updateUserUseCase.execute(newPassUser);
        } catch (error) {
            throw new Error(ErrorMessages[ErroCodes.USER_EMAIL_NOT_FOUND]);
        }

        this.sendMailUseCase.execute(
            user.email,
            "Recuperação de senha",
            undefined,
            process.env.MAILTRAP_RECOVERYPASSWORD_LAYOUT,
            {
                temp_pass: String(tempPassword),
                support_mail: process.env.MAILTRAP_FROM_EMAIL ?? ''
            }
        );

        return {
            message: "Email enviado com sucesso"
        }
    }
}