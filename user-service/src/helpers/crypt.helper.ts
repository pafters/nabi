'use strict';

import * as jwt from 'jsonwebtoken';
import { BaseError, TokenObject } from '../types/user';
import 'dotenv/config';

export function crypt(data: any): TokenObject | BaseError {
    try {
        const { CRYPT_SECRET_KEY } = process.env;
        if (CRYPT_SECRET_KEY) {
            const token = jwt.sign(data, CRYPT_SECRET_KEY);
            return { token };
        }
        return { message: 'crypt_secret_error', status: 500 };
    } catch (e) {
        return { message: 'crypt_token_error', status: 500 };
    }
}

export function decrypt(token: string): any | BaseError {
    try {
        const { CRYPT_SECRET_KEY } = process.env;
        if (CRYPT_SECRET_KEY) {
            const data = jwt.verify(token, CRYPT_SECRET_KEY);
            return data;
        }
        return { message: 'decrypt_token_error', status: 500 };
    } catch (e) {

        return { message: 'unconfirmed_token', status: 404 };
    }


}