"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DetailSong {
    constructor(title, formats, thumbnail, isSoLong) {
        this.isSoLong = undefined;
        this.title = title;
        this.formats = formats;
        this.thumbnail = thumbnail;
        if (isSoLong) {
            this.isSoLong = isSoLong;
        }
    }
}
exports.default = DetailSong;
//# sourceMappingURL=DetailSong.js.map