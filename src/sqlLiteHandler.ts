import { Database } from "sqlite3";

export function run(db: Database, sql: string, params: any): Promise<number> {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        console.log("from run method:%s", err.message);
        reject(err);
      }
      resolve(this.lastID);
    });
  });
}

export function all(db: Database, sql: string, params?: any): Promise<any[]> {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        console.log("from all method:%s", err.message);
        reject(err);
      }
      resolve(rows);
    });
  });
}
