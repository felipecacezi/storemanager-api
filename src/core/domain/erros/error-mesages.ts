import { ErroCodes } from "../enums/error-codes.js";

export const ErrorMessages = {
    [ErroCodes.USER_UNAUTHORIZED]: "O e-mail ou senha informados estão incorretos (cod.: 401001)",
    [ErroCodes.USER_PASSWORD_REQUIRED]: "A senha é obrigatória (cod.: 400001)",
    [ErroCodes.USER_ALREADY_EXISTS]: "O e-mail informado já está cadastrado (cod.: 400002)",
}