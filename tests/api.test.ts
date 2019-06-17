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

  describe(" GET /health", () => {
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
        .expect(response => {
          if (response.body.error_code) {
            console.log(response.body.error_code);
            console.log(response.body.message);
            return assert.fail(response.body.message);
          }
        })
        .expect(200, done);
    });
  });
});
