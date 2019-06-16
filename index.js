"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var body_parser_1 = require("body-parser");
var express_1 = __importDefault(require("express"));
var sqlite3_1 = __importDefault(require("sqlite3"));
var winston = require("winston");
var app_1 = require("./src/app");
var schemas_1 = require("./src/schemas");
var app = express_1.default();
var port = 8010;
var jsonParser = body_parser_1.json();
var sqlite3 = sqlite3_1.default.verbose();
var db = new sqlite3.Database(":memory:");
db.serialize(function () {
    schemas_1.buildSchemas(db);
    var thisApp = app_1.expressApp(db);
    thisApp.listen(port, function () { return winston.info("App started and listening on port " + port); });
});
