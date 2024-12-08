import { Context } from "moleculer";
import { BaseError, TokenData, TokenObject } from "../types/user";
import { crypt } from "../helpers/crypt.helper";

async function authorize(ctx: Context<TokenData>): Promise<TokenObject | BaseError> {
    const { chatId, username } = ctx.params;
    const data = crypt({ chatId, username });

    return data;
}

async function getUserByToken(ctx: Context) {
    return {}
}

export { authorize, getUserByToken }