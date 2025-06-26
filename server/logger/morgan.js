import morgan from "morgan";
import logger from "./index.js";
import { LogstashTransport } from "winston-logstash-transport";
import winston from "winston";

const stream = {
  write: (message) => logger.info(message.trim()),
};

const skip = () => process.env.NODE_ENV === "test";

const morganMiddleware = morgan(
  ":method :url :status :res[content-length] - :response-time ms",
  { stream, skip }
);

const loggerInstance = winston.createLogger({
  transports: [
    new LogstashTransport({
      host: "localhost",
      port: 5000,
      protocol: "tcp",
      appName: "auth-demo-backend", // optional, for log context
      format: winston.format.json(),
      level: "info",
    }),
  ],
});

export default morganMiddleware;
