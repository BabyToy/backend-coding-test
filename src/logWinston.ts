import winston = require("winston");
import path = require("path");
import fs = require("fs");

const version = "1.0.15";

const tsFormat = () => (new Date().getTime() / 1000).toString();
const apiFormat = winston.format.printf(info => {
  return `${info.timestamp} ${info.level}: ${info.message}`;
});
const combined = winston.format.combine(
  winston.format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss"
  }),
  apiFormat
);

let logDir: string;
let moduleName: string;

export class Winston {
  private _level: string;
  private filename: string;
  private winston: winston.Logger;

  constructor(module: string, parentDir?: string) {
    this._level = process.env.LOG_LEVEL || "info";
    this.filename = module + ".log";
    const targetPath = parentDir || "";
    logDir = path.join(targetPath, "logs");
    moduleName = module;
    winston.level = this._level;

    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir);
    }

    this.winston = winston.createLogger({
      transports: [
        new winston.transports.File({
          format: combined,
          level: "debug",
          filename: moduleName + ".log",
          dirname: "logs",
          handleExceptions: true
        }),
        // colorize the output to the console
        new winston.transports.Console({
          format: combined,
          level: "info",
          handleExceptions: true
        })
      ]
    });
  }

  set level(value: string) {
    this._level = value;
    this.winston.level = value;
  }

  get level(): string {
    return this._level;
  }

  error(text: string) {
    this.winston.error(moduleName + ": " + text);
  }

  info(text: string) {
    this.winston.info(moduleName + ": " + text);
  }

  status(data: { status: string; result: any }) {
    const message = JSON.stringify(data.result);
    this.winston.info(`${module}: status: ${data.status} message: ${message}`);
  }

  debug(text: string) {
    if (this.level !== "debug") {
      return;
    }
    this.winston.debug(`${moduleName}: ${text}`);
  }

  version() {
    return version;
  }
}
