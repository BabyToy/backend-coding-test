"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var supertest_1 = __importDefault(require("supertest"));
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(":memory:");
var app = require("../src/app")(db);
var schemas_1 = require("../src/schemas");
describe("API tests", function () {
    before(function (done) {
        db.serialize(function (err) {
            if (err) {
                return done(err);
            }
            schemas_1.buildSchemas(db);
            done();
        });
    });
    describe("GET /health", function () {
        it("should return health", function (done) {
            supertest_1.default(app)
                .get("/health")
                .expect("Content-Type", /text/)
                .expect(200, done);
        });
    });
});
