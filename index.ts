init("CodingExercise", __dirname);
info("start of app");

import express from "express";
const app = express();
const port = 8010;

import { json } from "body-parser";
const jsonParser = json();

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(":memory:");

import buildSchemas from "./src/schemas";

db.serialize(() => {
  buildSchemas(db);

  const app = require("./src/app")(db);

  app.listen(port, () =>
    console.log(`App started and listening on port ${port}`)
  );
});
