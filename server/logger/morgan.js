import morgan from "morgan";
import logger from "./index.js";
import { LogstashTransport } from "winston-logstash-transport";
import winston from "winston";

// Create a stream object with a 'write' function for morgan
const stream = {
  write: (message) => logger.info(message.trim()),
};

// Skip logging in test environment
const skip = () => process.env.NODE_ENV === "test";

const morganMiddleware = morgan(
  ":method :url :status :res[content-length] - :response-time ms",
  { stream, skip }
);

const loggerInstance = winston.createLogger({
  transports: [
    new LogstashTransport({
      host: "localhost", // or your logstash server IP
      port: 5000, // match your Logstash input port
      protocol: "tcp", // or 'udp'
      appName: "auth-demo-backend", // optional, for log context
      format: winston.format.json(), // send logs as JSON
      level: "info", // or 'error', etc.
    }),
  ],
});

export default morganMiddleware;
