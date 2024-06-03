import db from "Config/db";

class Song {
  insetSong(path: string): Promise<{ id: number }> {
    return new Promise((resolve, reject) => {
      db.run("INSERT INTO songs (path) VALUES (?)", [path], function (err) {
        if (err) {
          reject(err);
        }
        resolve({ id: this.lastID });
      });
    });
  }

  selectSongs(): Promise<Array<{ id: number; path: string }>> {
    return new Promise((resolve, reject) => {
      db.each(
        "SELECT * FROM songs",
        (err, row) => {
          if (err) {
            reject(err);
          }
          resolve(row);
        },
        () => {
          resolve([]);
        }
      );
    });
  }

  selectSong(id: number): Promise<{ id: number; path: string }> {
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM songs WHERE id = ?", [id], (err, row) => {
        if (err) {
          reject(err);
        }
        resolve(row);
      });
    });
  }

  deletSong(id: number) {
    return new Promise((resolve, reject) => {
      db.run("DELETE FROM songs WHERE id = ?", [id], (err) => {
        if (err) {
          reject(err);
        }
        resolve(true);
      });
    });
  }
}

export default new Song();
