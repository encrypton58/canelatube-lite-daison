"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = __importDefault(require("fs/promises"));
const DownloadMusic_1 = __importDefault(require("./DownloadMusic"));
class SpawnProcessesController {
    constructor() {
        this.REQUIRED = "required";
        this.VALID_URL = "valid_url";
        this.VIDEO_UNAVAILABLE = "video_unavailable";
        this.VIDEO_LONG = "video_long";
        this.UNKNOW_ERROR = "unknow_error";
        this.URL_DOWNLOAD = "downloads/audio/";
    }
    async getFormatsToDownload(url) {
        const formats = await new DownloadMusic_1.default().getFormatsToDownload(url.toString());
        return formats;
    }
    async download(itag, url) {
        return await new DownloadMusic_1.default().downloadNew(itag, url);
    }
    async destroy(routeFile) {
        await promises_1.default.unlink(routeFile);
    }
}
exports.default = SpawnProcessesController;
//# sourceMappingURL=SpawnProcessesController.js.map