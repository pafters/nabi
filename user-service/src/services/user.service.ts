'use strict';

import { Context, ServiceSchema } from "moleculer";
import { crypt } from "../helpers/crypt.helper";
import { BaseError, TokenData, TokenObject } from "../types/user";
import 'dotenv';
import * as UserController from "../controllers/user.controller";


const TelegramService: ServiceSchema = {
    version: 1,
    name: 'user-service',
    actions: {
        async authorize(ctx: Context<TokenData>): Promise<TokenObject | BaseError> {
            return await UserController.authorize(ctx)
        },

        async getUserByToken(ctx: Context) {
            return await UserController.getUserByToken(ctx);
        }
    },
    async created() {
    },
    async started() {
    },
    async stopped() {
    }
};

export default TelegramService;