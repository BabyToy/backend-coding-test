import { json } from "body-parser";
import express from "express";
import provider from "sqlite3";
import { Winston } from "./src/logWinston";
const winston = new Winston("CodingExercise", __dirname);

import { expressApp } from "./src/app";
import { buildSchemas } from "./src/schemas";

const app = express();
const port = 8010;

const jsonParser = json();

const sqlite3 = provider.verbose();
const db = new sqlite3.Database(":memory:");

db.serialize(() => {
  buildSchemas(db);

  const thisApp = expressApp(db);
  thisApp.listen(port, () => winston.info(`App started and listening on port ${port}`));
});
