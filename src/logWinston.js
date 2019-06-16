"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var winston = require("winston");
var path = require("path");
var fs = require("fs");
var version = "1.0.15";
var tsFormat = function () { return (new Date().getTime() / 1000).toString(); };
var apiFormat = winston.format.printf(function (info) {
    return info.timestamp + " " + info.level + ": " + info.message;
});
var combined = winston.format.combine(winston.format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss"
}), apiFormat);
var logDir;
var module;
var Winston = /** @class */ (function () {
    function Winston(module, parentDir) {
        this._level = process.env.LOG_LEVEL || "info";
        this.filename = module + ".log";
        var targetPath = parentDir || "";
        logDir = path.join(targetPath, "logs");
        module = module;
        winston.level = this._level;
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir);
        }
        this.winston = winston.createLogger({
            transports: [
                new winston.transports.File({
                    format: combined,
                    level: "debug",
                    filename: module + ".log",
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
    Object.defineProperty(Winston.prototype, "level", {
        get: function () {
            return this._level;
        },
        set: function (value) {
            this._level = value;
            this.winston.level = value;
        },
        enumerable: true,
        configurable: true
    });
    Winston.prototype.error = function (text) {
        this.winston.error(module + ": " + text);
    };
    Winston.prototype.info = function (text) {
        this.winston.info(module + ": " + text);
    };
    Winston.prototype.status = function (data) {
        var message = JSON.stringify(data.result);
        this.winston.info(module + ": status: " + data.status + " message: " + message);
    };
    Winston.prototype.debug = function (text) {
        if (this.level !== "debug") {
            return;
        }
        this.winston.debug(module + ": " + text);
    };
    Winston.prototype.version = function () {
        return version;
    };
    return Winston;
}());
exports.Winston = Winston;
