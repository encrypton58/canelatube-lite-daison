"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Messages_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Constants/Messages"));
const ResponseConstants_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Constants/ResponseConstants"));
const ServerException_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Exceptions/ServerException"));
const MessagesTranslates_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Language/MessagesTranslates"));
const fs_1 = __importDefault(require("fs"));
const sqlite3 = require("sqlite3").verbose();
const filePath = "./songs.db";
class Database {
    createDb() {
        if (!fs_1.default.existsSync(filePath)) {
            const db = new sqlite3.Database(filePath, (err) => {
                if (err) {
                    throw new ServerException_1.default(ResponseConstants_1.default.E_DATABASE_ERROR_PROCESS_CODE, ResponseConstants_1.default.STATUS_CODE_ERROR_INTERNAL_SERVER, MessagesTranslates_1.default.errorSpawnProcess(Messages_1.default.SERVER_BD_ERROR), [], err.message);
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
        db.exec("CREATE TABLE IF NOT EXISTS songs (id INTEGER PRIMARY KEY AUTOINCREMENT, path TEXT)");
    }
}
exports.default = new Database().createDb();
//# sourceMappingURL=db.js.map