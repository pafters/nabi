import { Context } from 'moleculer';
import { ServiceSchema } from 'moleculer';

import Koa, { Context as httpContext, Request } from 'koa';
import Router from 'koa-router';
import logger from 'koa-logger';
import session from 'koa-session';
import cors from 'koa2-cors';
import bodyParser from '@koa/bodyparser';


const ApiService: ServiceSchema = {
    name: 'api', // Изменено имя сервиса
    version: 1,
    settings: {
        koaPathPrefix: '/rest/v1',
        koaSession: {
            key: 'koa.sess',
            sameSite: 'lax', // Более безопасно
            secure: false, // НЕБЕЗОПАСНО в продакшне!  Должно быть true, если используется HTTPS
            httpOnly: true
        },
        koaCors: {
            origin: '*', // НЕБЕЗОПАСНО в продакшне!  Укажите конкретные домены
            allowMethods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH'],
            allowHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Authorization', 'Accept'],
            exposedHeaders: ['Content-Disposition'],
            credentials: true,
            maxAge: 3600
        },
        restRoutes: {
            test: { url: '/test' }
        },
        port: 5000
    },

    created() {
        this.logger.info('v1.api-service has been created');

        this.app = new Koa({ proxy: true });
        this.router = new Router({ prefix: this.settings.koaPathPrefix });

        this.app.keys = ['COOKIESECRET'];
        this.app.use(session(this.settings.koaSession, this.app));
        this.app.use(cors(this.settings.koaCors));
        this.app.use(bodyParser());
        this.initRoutes();
        this.app.use(this.router.routes()).use(this.router.allowedMethods());
        this.app.use(logger());

        this.app.use(async (ctx: httpContext, next: any) => {
            try {
                await next();
            } catch (err: any) {
                ctx.status = err.statusCode || err.status || 500;
                ctx.body = { message: err.message };
                this.logger.error(err);
            }
        });
    },

    methods: {
        initRoutes() {
            this.router.get(this.settings.restRoutes.test.url, this.test);
        },
        async test(ctx: httpContext) {
            try {
                const res: Context = await this.broker.call('v1.telegram-service.sendMessage', { message: 'Привет!' }); // Изменено обращение к сервису
                ctx.body = res;
                ctx.status = 200;
            } catch (error) {
                this.logger.error("Error calling telegram service:", error);
                ctx.status = 500;
                ctx.body = { error: "Internal Server Error" };
            }
        }
    },

    async started() {
        try {
            this.server = this.app.listen(this.settings.port, () => {
                this.logger.info(`Koa server listening on port ${this.settings.port}`);
            });
        } catch (error) {
            this.logger.error("Error starting Koa server:", error);
        }
    },

    async stopped() {
        if (this.server) {
            this.server.close();
            this.logger.info('Koa server stopped');
        }
    },
};

export default ApiService;