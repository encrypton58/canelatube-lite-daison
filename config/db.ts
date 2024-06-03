import Messages from "App/Constants/Messages";
import ResponseConstants from "App/Constants/ResponseConstants";
import ServerException from "App/Exceptions/ServerException";
import MessagesTranslates from "App/Language/MessagesTranslates";
import fs from "fs";

const sqlite3 = require("sqlite3").verbose();
const filePath = "./songs.db";

class Database {
  createDb() {
    if (!fs.existsSync(filePath)) {
      const db = new sqlite3.Database(filePath, (err) => {
        if (err) {
          throw new ServerException(
            ResponseConstants.E_DATABASE_ERROR_PROCESS_CODE,
            ResponseConstants.STATUS_CODE_ERROR_INTERNAL_SERVER,
            MessagesTranslates.errorSpawnProcess(Messages.SERVER_BD_ERROR),
            [],
            err.message
          );
        }
        this.createTable(db);
      });
      return db;
    }
    const db = new sqlite3.Database(filePath);
    this.createTable(db);
    return new sqlite3.Database(filePath);
  }

  createTable(db) {
    db.exec(
      "CREATE TABLE IF NOT EXISTS songs (id INTEGER PRIMARY KEY AUTOINCREMENT, path TEXT)"
    );
  }
}

export default new Database().createDb();
