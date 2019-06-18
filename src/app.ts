import bodyParser from 'body-parser';
import express from 'express';
import { Database } from 'sqlite3';

import { Winston } from './logWinston';
import sqlHandler = require('./sqlLiteHandler');

const winston = new Winston("CodingExercise", __dirname);

const app = express();

const jsonParser = bodyParser.json();

export function expressApp(db: Database) {
  app.get("/health", (req, res) => res.send("Healthy"));

  app.post("/rides", jsonParser, async (req, res) => {
    const startLatitude = Number(req.body.start_lat);
    const startLongitude = Number(req.body.start_long);
    const endLatitude = Number(req.body.end_lat);
    const endLongitude = Number(req.body.end_long);
    const riderName = req.body.rider_name;
    const driverName = req.body.driver_name;
    const driverVehicle = req.body.driver_vehicle;

    if (
      startLatitude < -90 ||
      startLatitude > 90 ||
      startLongitude < -180 ||
      startLongitude > 180
    ) {
      return res.send({
        error_code: "VALIDATION_ERROR",
        message:
          "Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively"
      });
    }

    if (endLatitude < -90 || endLatitude > 90 || endLongitude < -180 || endLongitude > 180) {
      return res.send({
        error_code: "VALIDATION_ERROR",
        message:
          "End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively"
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
        message: "Driver name must be a non empty string"
      });
    }

    if (typeof driverVehicle !== "string" || driverVehicle.length < 1) {
      return res.send({
        error_code: "VALIDATION_ERROR",
        message: "Vehicle name must be a non empty string"
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

    try {
      const lastId = await sqlHandler.run(
        db,
        "INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)",
        values
      );
      const rows = await sqlHandler.all(db, "SELECT * FROM Rides WHERE rideID = ?", lastId);
      res.send(rows);
    } catch (error) {
      return res.send({
        error_code: "SERVER_ERROR",
        message: error.message
      });
    }
  });

  app.get("/rides", async (req, res) => {
    const { id, pageSize, page } = req.query;
    try {
      let sql = "SELECT * FROM Rides";
      if (id) {
        sql = sql + ` WHERE rideID=${id}`;
      } else {
        const size = parseInt(pageSize || 0, 10);
        if (size > 0) {
          const pageNum = parseInt(page || 0, 10);
          sql = sql + ` ORDER BY rideID LIMIT ${pageSize} OFFSET ${pageNum * size}`;
        }
      }
      const rows = await sqlHandler.all(db, sql);
      if (rows.length === 0) {
        return res.send({
          error_code: "RIDES_NOT_FOUND_ERROR",
          message: "Could not find any rides"
        });
      }
      res.send(rows);
    } catch (error) {
      return res.send({
        error_code: "SERVER_ERROR",
        message: error.message
      });
    }
  });

  return app;
}
