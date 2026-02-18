export interface PasswordGeneratorOptions {
    length?: number;
    includeNumbers?: boolean;
    includeSymbols?: boolean;
}

export interface PasswordGenerator {
    generate(options?: PasswordGeneratorOptions): string;
}