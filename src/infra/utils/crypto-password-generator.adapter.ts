import { randomInt } from 'node:crypto';
import type { PasswordGeneratorOptions, PasswordGenerator } from '../../core/application/repositories/password-generator.js';

export class CryptoPasswordGenerator implements PasswordGenerator {
    generate({ length, includeNumbers, includeSymbols }: PasswordGeneratorOptions): string {
        const options = {
            length: length ?? 1,
            includeNumbers: includeNumbers ?? false,
            includeSymbols: includeSymbols ?? false
        };
        const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';
        const symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

        let characters = letters;
        if (includeNumbers) characters += numbers;
        if (includeSymbols) characters += symbols;

        let password = '';
        for (let i = 0; i < options.length; i++) {
            const randomIndex = randomInt(0, characters.length);
            password += characters.charAt(randomIndex);
        }

        return String(password);
    }
}