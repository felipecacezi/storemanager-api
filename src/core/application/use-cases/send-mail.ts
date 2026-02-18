import { MailtrapEmailAdapter } from "../../../infra/adapters/email/mailtrap-email.adapter.js";

export class SendMailUseCase {
    constructor(
        private mailtrapEmailAdapter: MailtrapEmailAdapter
    ) { }

    async execute(
        email: string,
        subject: string,
        body: string | undefined = undefined,
        templateUuid: string | undefined = undefined,
        templateVariables: Record<string, string> | undefined = undefined) {

        await this.mailtrapEmailAdapter.send({
            to: email,
            subject: subject,
            body: body,
            templateUuid: templateUuid,
            templateVariables: templateVariables,
        });
    }
}
