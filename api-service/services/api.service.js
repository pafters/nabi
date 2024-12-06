'use strict';
const Koa = require('koa');
const Router = require('koa-router');
const Logger = require('koa-logger')
const Session = require('koa-session')
const Cors = require('@koa/cors')
const { bodyParser } = require('@koa/bodyparser')

module.exports = {
    version: 1,
    name: 'api-service',
    settings: {

        koaPathPrefix: '/rest/' + 'v1', // ВАЖНО: не завершать слешем

        koaSession: {
            key: 'koa.sess',
            sameSite: 'none',
            secure: false,
            httpOnly: true
        },

        koaCors: {
            origin: '*',
            allowMethods: ['GET, HEAD, PUT, POST, DELETE, PATCH'],
            allowHeaders: ['Origin, X-Requested-With, Content-Type, Authorization, Accept'],
            exposedHeaders: ['Content-Disposition'],
            credentials: true, // ОБЯЗАТЕЛЬНО!!!
            maxAge: 3600
        },

        restRoutes: {
            test: { url: '/test' },
        },

        port: 5000
    },
    actions: {

    },
    methods: {
        initRoutes(app, router) { // РОУТЫ REST API
            router.get(this.settings.restRoutes.test.url, this.test);
        },

        async test(ctx) { // Получение данных пользователя
            const res = await this.broker.call('v1.telegram-service.sendMessage', { message: 'Привет!' });
            ctx.response.body = res;
            ctx.response.status = 200;
        },
    },
    
    async created() {
        this.logger.info('v1.api-service has been created');;

        let httpServer = new Koa({ proxy: true });
        let router = new Router({ prefix: this.settings.koaPathPrefix });

        // Подключаем модуль обработки Cookie
        httpServer.keys = ['COOKIESECRET'];
        httpServer.use(Session(this.settings.koaSession, httpServer));

        // Подключаем модуль обработки CORS
        httpServer.use(Cors(this.settings.koaCors));

        // Подключаем модуль bodyParser
        httpServer.use(bodyParser());

        // Подключаем RestAPI Routes
        this.initRoutes(httpServer, router);
        httpServer.use(router.routes()).use(router.allowedMethods());

        // HTTP-request logger
        httpServer.use(Logger());

        httpServer.use(async (ctx, next) => {
            try {
                await next();
            }
            catch (err) {

                ctx.status = err.statusCode || err.status || 500;
                ctx.body = { message: err.message };
                ctx.httpServer.emit('error', err, ctx);
            }
        });

        // Пишем соединения в контекст
        this.httpServer = httpServer;
    },
    async started() {

        this.httpServer.listen(this.settings.port, () => {
            this.logger.info(`Koa server listening on port ${this.settings.port}`);
        });

    },
    async stopped() {
        this.httpServer.close();
        this.logger.info('Koa server stopped');
    }
};