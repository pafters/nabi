module.exports = {
    transporter: "NATS", // Используем NATS
    nodeID: process.env.NODE_ID || "api-service",
    transporter: {
        type: 'NATS',
        options: {
            url: 'nats://nats:4222'
        }
    },
    logger: console,
    logger: {
        type: 'Console',   // логируем в консоль
        options: {
            colors: true,
            moduleColors: false,
            formatter: 'full',
            objectPrinter: null,
            autoPadding: false
        },
    },
    logLevel: 'debug',
    middlewares: [],
    errorHandler(err, info) {

        this.logger.warn('Log the error:', err)
        throw err
    }
};