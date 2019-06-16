"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function buildSchemas(db) {
    var createRideTableSchema = "\n        CREATE TABLE Rides\n        (\n        rideID INTEGER PRIMARY KEY AUTOINCREMENT,\n        startLat DECIMAL NOT NULL,\n        startLong DECIMAL NOT NULL,\n        endLat DECIMAL NOT NULL,\n        endLong DECIMAL NOT NULL,\n        riderName TEXT NOT NULL,\n        driverName TEXT NOT NULL,\n        driverVehicle TEXT NOT NULL,\n        created DATETIME default CURRENT_TIMESTAMP\n        )\n    ";
    db.run(createRideTableSchema);
    return db;
}
exports.buildSchemas = buildSchemas;
