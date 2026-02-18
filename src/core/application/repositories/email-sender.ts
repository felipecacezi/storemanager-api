export interface EmailPayload {
    to: string;
    subject: string;
    body: string | undefined;
    templateUuid: string | undefined;
    templateVariables?: Record<string, string> | undefined;
}

export interface EmailSender {
    send(email: EmailPayload): Promise<void>;
}