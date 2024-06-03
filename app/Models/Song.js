"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(global[Symbol.for('ioc.use')]("Config/db"));
class Song {
    insetSong(path) {
        return new Promise((resolve, reject) => {
            db_1.default.run("INSERT INTO songs (path) VALUES (?)", [path], function (err) {
                if (err) {
                    reject(err);
                }
                resolve({ id: this.lastID });
            });
        });
    }
    selectSongs() {
        return new Promise((resolve, reject) => {
            db_1.default.each("SELECT * FROM songs", (err, row) => {
                if (err) {
                    reject(err);
                }
                resolve(row);
            }, () => {
                resolve([]);
            });
        });
    }
    selectSong(id) {
        return new Promise((resolve, reject) => {
            db_1.default.get("SELECT * FROM songs WHERE id = ?", [id], (err, row) => {
                if (err) {
                    reject(err);
                }
                resolve(row);
            });
        });
    }
    deletSong(id) {
        return new Promise((resolve, reject) => {
            db_1.default.run("DELETE FROM songs WHERE id = ?", [id], (err) => {
                if (err) {
                    reject(err);
                }
                resolve(true);
            });
        });
    }
}
exports.default = new Song();
//# sourceMappingURL=Song.js.map