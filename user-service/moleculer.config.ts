import { BrokerOptions } from "moleculer";

const config: BrokerOptions = {
  nodeID: "user-service",
  transporter: {
    type: "NATS" as const,
    options: {
      url: "nats://nats:4222",
    },
  },
  logger: {
    type: "Console" as const, // Строгая типизация
    options: {
      colors: true,
      moduleColors: false,
      formatter: "full",
      objectPrinter: null,
      autoPadding: false,
    },
  },
  logLevel: "debug" as const,  // Строгая типизация
  middlewares: [] as any[], // Уточняем тип, если middlewares используются
  errorHandler: (err: Error, info: any) => { // Уточняем тип ошибки
    console.warn("Log the error:", err); // Можно использовать console.warn напрямую
    throw err;
  },
};

export default config;