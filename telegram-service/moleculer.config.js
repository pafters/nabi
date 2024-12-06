module.exports = {
  transporter: "NATS",
  nodeID: process.env.NODE_ID || "telegram-service",
  transporter: {
    type: 'NATS',
    options: {
      url: 'nats://nats:4222'
    }
  },
  logger: {
    type: 'Console',
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
    this.logger.warn('Log the error:', err);
    throw err;
  }
};