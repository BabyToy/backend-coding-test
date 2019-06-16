"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var body_parser_1 = __importDefault(require("body-parser"));
var express_1 = __importDefault(require("express"));
var logWinston_1 = require("./logWinston");
var winston = new logWinston_1.Winston("CodingExercise", __dirname);
var app = express_1.default();
var jsonParser = body_parser_1.default.json();
function expressApp(db) {
    // module.exports = db => {
    app.get("/health", function (req, res) { return res.send("Healthy"); });
    app.post("/rides", jsonParser, function (req, res) {
        var startLatitude = Number(req.body.start_lat);
        var startLongitude = Number(req.body.start_long);
        var endLatitude = Number(req.body.end_lat);
        var endLongitude = Number(req.body.end_long);
        var riderName = req.body.rider_name;
        var driverName = req.body.driver_name;
        var driverVehicle = req.body.driver_vehicle;
        if (startLatitude < -90 ||
            startLatitude > 90 ||
            startLongitude < -180 ||
            startLongitude > 180) {
            return res.send({
                error_code: "VALIDATION_ERROR",
                message: "Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively"
            });
        }
        if (endLatitude < -90 || endLatitude > 90 || endLongitude < -180 || endLongitude > 180) {
            return res.send({
                error_code: "VALIDATION_ERROR",
                message: "End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively"
            });
        }
        if (typeof riderName !== "string" || riderName.length < 1) {
            return res.send({
                error_code: "VALIDATION_ERROR",
                message: "Rider name must be a non empty string"
            });
        }
        if (typeof driverName !== "string" || driverName.length < 1) {
            return res.send({
                error_code: "VALIDATION_ERROR",
                message: "Rider name must be a non empty string"
            });
        }
        if (typeof driverVehicle !== "string" || driverVehicle.length < 1) {
            return res.send({
                error_code: "VALIDATION_ERROR",
                message: "Rider name must be a non empty string"
            });
        }
        var values = [
            req.body.start_lat,
            req.body.start_long,
            req.body.end_lat,
            req.body.end_long,
            req.body.rider_name,
            req.body.driver_name,
            req.body.driver_vehicle
        ];
        var result = db.run("INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)", values, function (err) {
            if (err) {
                return res.send({
                    error_code: "SERVER_ERROR",
                    message: "Unknown error"
                });
            }
            db.all("SELECT * FROM Rides WHERE rideID = ?", this.lastID, function (err, rows) {
                if (err) {
                    return res.send({
                        error_code: "SERVER_ERROR",
                        message: "Unknown error"
                    });
                }
                res.send(rows);
            });
        });
    });
    app.get("/rides", function (req, res) {
        db.all("SELECT * FROM Rides", function (err, rows) {
            if (err) {
                return res.send({
                    error_code: "SERVER_ERROR",
                    message: "Unknown error"
                });
            }
            if (rows.length === 0) {
                return res.send({
                    error_code: "RIDES_NOT_FOUND_ERROR",
                    message: "Could not find any rides"
                });
            }
            res.send(rows);
        });
    });
    app.get("/rides/:id", function (req, res) {
        db.all("SELECT * FROM Rides WHERE rideID='" + req.params.id + "'", function (err, rows) {
            if (err) {
                return res.send({
                    error_code: "SERVER_ERROR",
                    message: "Unknown error"
                });
            }
            if (rows.length === 0) {
                return res.send({
                    error_code: "RIDES_NOT_FOUND_ERROR",
                    message: "Could not find any rides"
                });
            }
            res.send(rows);
        });
    });
    return app;
}
exports.expressApp = expressApp;
