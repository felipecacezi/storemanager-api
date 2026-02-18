import { MailtrapClient } from "mailtrap";
import type { EmailPayload, EmailSender } from "../../../core/application/repositories/email-sender.js";
import dotenv from 'dotenv';
dotenv.config();

export class MailtrapEmailAdapter implements EmailSender {
    private client: MailtrapClient;
    private readonly FROM_EMAIL = process.env.MAILTRAP_FROM_EMAIL ?? '';
    private readonly FROM_NAME = process.env.MAILTRAP_FROM_NAME ?? '';
    private readonly TOKEN = process.env.MAILTRAP_TOKEN ?? '';
    private readonly ENDPOINT = process.env.MAILTRAP_ENDPOINT ?? '';

    constructor() {
        this.client = new MailtrapClient({
            token: this.TOKEN,
            endpoint: this.ENDPOINT,
        })
    }

    async send({ to, subject, body, templateUuid, templateVariables }: EmailPayload): Promise<void> {
        const mailOptions: any = {
            from: { email: this.FROM_EMAIL, name: this.FROM_NAME },
            to: [{ email: to }],
        };

        if (templateUuid) {
            mailOptions.template_uuid = templateUuid;
            mailOptions.template_variables = templateVariables ?? {};
        } else {
            mailOptions.subject = subject;
            mailOptions.html = body;
        }

        await this.client.send(mailOptions);
    }
}