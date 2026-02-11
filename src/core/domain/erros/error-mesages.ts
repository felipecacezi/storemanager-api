import { ErroCodes } from "../enums/error-codes.js";

export const ErrorMessages = {
    [ErroCodes.USER_UNAUTHORIZED]: "O e-mail ou senha informados estão incorretos (cod.: 401001)",
    [ErroCodes.USER_ALREADY_EXISTS]: "O e-mail informado já está cadastrado (cod.: 400002)",
    [ErroCodes.TOKEN_NOT_PROVIDED]: "Token não fornecido (cod.: 401003)",
    [ErroCodes.TOKEN_INVALID]: "Token inválido (cod.: 401004)",
    [ErroCodes.TOKEN_EXPIRED]: "Token expirado (cod.: 401005)",
    [ErroCodes.TOKEN_NOT_FOUND]: "Token não encontrado (cod.: 401006)",
    [ErroCodes.USER_PASSWORD_REQUIRED]: "A senha é obrigatória (cod.: 400007)",
}