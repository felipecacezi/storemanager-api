import { ErroCodes } from "../enums/error-codes.js";

export const ErrorMessages = {
    [ErroCodes.USER_UNAUTHORIZED]: "O e-mail ou senha informados estão incorretos (cod.: 401001)",
    [ErroCodes.USER_ALREADY_EXISTS]: "O e-mail informado já está cadastrado (cod.: 400002)",
    [ErroCodes.TOKEN_NOT_PROVIDED]: "Token não fornecido (cod.: 401003)",
    [ErroCodes.TOKEN_INVALID]: "Token inválido (cod.: 401004)",
    [ErroCodes.TOKEN_EXPIRED]: "Token expirado (cod.: 401005)",
    [ErroCodes.TOKEN_NOT_FOUND]: "Token não encontrado (cod.: 401006)",
    [ErroCodes.USER_PASSWORD_REQUIRED]: "A senha é obrigatória (cod.: 400007)",
    [ErroCodes.USER_NAME_REQUIRED]: "O nome é obrigatório (cod.: 400008)",
    [ErroCodes.USER_EMAIL_REQUIRED]: "O e-mail é obrigatório (cod.: 400009)",
    [ErroCodes.USER_NAME_MIN_LENGTH]: "O nome deve ter pelo menos 3 caracteres (cod.: 400010)",
    [ErroCodes.USER_EMAIL_MIN_LENGTH]: "O e-mail deve ter pelo menos 3 caracteres (cod.: 400011)",
    [ErroCodes.USER_PASSWORD_MIN_LENGTH]: "A senha deve ter pelo menos 6 caracteres (cod.: 400012)",
    [ErroCodes.USER_EMAIL_INVALID]: "O e-mail informado é inválido (cod.: 400013)",
    [ErroCodes.USER_NAME_INVALID]: "O nome informado é inválido (cod.: 400014)",
    [ErroCodes.USER_NOT_FOUND]: "Usuário não encontrado (cod.: 400015)",
    [ErroCodes.USER_ID_REQUIRED]: "O id do usuário é obrigatório (cod.: 400016)",
}