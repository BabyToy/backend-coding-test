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
});
