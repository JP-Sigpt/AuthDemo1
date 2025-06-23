import winston from "winston";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import DailyRotateFile from "winston-daily-rotate-file";
import { LogstashTransport } from "winston-logstash-transport";

const __dirname = dirname(fileURLToPath(import.meta.url));
const logDir = path.join(__dirname, "../logs");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message} ${
        Object.keys(meta).length ? JSON.stringify(meta) : ""
      }`;
    })
  ),
  transports: [
    new DailyRotateFile({
      filename: path.join(logDir, "app-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d", // keep logs for 14 days
    }),
    new DailyRotateFile({
      filename: path.join(logDir, "error-%DATE%.log"),
      level: "error",
      datePattern: "YYYY-MM-DD",
      maxFiles: "30d", // keep error logs for 30 days
    }),
    new LogstashTransport({
      host: "localhost", // Change to your Logstash server IP if needed
      port: 5000, // Match your Logstash input port
      protocol: "tcp", // or 'udp'
      appName: "auth-demo-backend",
      format: winston.format.json(),
      level: "info",
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

export default logger;
