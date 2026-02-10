export interface Jwt {
    generateToken(payload: any): Promise<string>;
    verifyToken(token: string): Promise<any>;
    decodeToken(token: string): Promise<any>;
}