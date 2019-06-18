import assert = require("assert");
import request from "supertest";

import { expressApp } from "../src/app";
import { buildSchemas } from "../src/schemas";

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(":memory:");

// const app = require("../src/app")(db);
const thisApp = expressApp(db);

describe("API tests", () => {
  before(done => {
    db.serialize((err: Error) => {
      if (err) {
        return done(err);
      }

      buildSchemas(db);

      done();
    });
  });

  describe("GET /health", () => {
    it("should return health", done => {
      request(thisApp)
        .get("/health")
        .expect("Content-Type", /text/)
        .expect(200, done);
    });
  });

  describe("POST /rides", () => {
    it("should return a list", done => {
      request(thisApp)
        .post("/rides")
        .send({
          start_lat: 12,
          start_long: 11,
          end_lat: 13,
          end_long: 12,
          rider_name: "me",
          driver_name: "driver",
          driver_vehicle: "vehicle"
        })
        .expect("Content-Type", /json/)
        .expect(200)
        .end((error, response) => {
          assert(response.body.length > 0, "empty list");
          done();
        });
    });
  });

  describe("GET /rides", () => {
    it("return rideID 1", done => {
      const id = 1;
      request(thisApp)
        .get("/rides")
        .query({ id })
        .expect("Content-Type", /json/)
        .expect(200)
        .end((error, response) => {
          assert(response.body.length, "empty list");
          assert.strictEqual(response.body[0].rideID, id, "ride not found");
          done();
        });
    });

    it("return list of rides", done => {
      request(thisApp)
        .get("/rides")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((error, response) => {
          assert(response.body.length, "empty list");
          assert(response.body[0].rideID, "invalid ride ID");
          done();
        });
    });

    it("return RIDES_NOT_FOUND_ERROR for invalid ID", done => {
      const id = 2;
      request(thisApp)
        .get("/rides")
        .query({ id })
        .expect("Content-Type", /json/)
        .expect(200)
        .end((error, response) => {
          assert.strictEqual(
            response.body.error_code,
            "RIDES_NOT_FOUND_ERROR",
            response.body.error_code
          );
          done();
        });
    });
  });
});
