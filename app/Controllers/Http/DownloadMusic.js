"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const ytdl_core_1 = __importDefault(require("ytdl-core"));
const fs_1 = __importDefault(require("fs"));
const ffmpeg_static_1 = __importDefault(require("ffmpeg-static"));
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const node_id3_1 = __importDefault(require("node-id3"));
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const ConstantsControllers_1 = __importDefault(require("../ConstantsControllers"));
const ServerException_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Exceptions/ServerException"));
const ResponseConstants_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Constants/ResponseConstants"));
const MessagesTranslates_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Language/MessagesTranslates"));
const Messages_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Constants/Messages"));
class DownloadMusic {
    constructor() {
        this.AUDIO_ONLY_FILTER = "audioonly";
        this.prefixPathRoot = path_1.default.join(__dirname, "../../../public/api/v1/");
        this.audioPath = path_1.default.join(this.prefixPathRoot, "audio/");
        this.defaultImageAlbumArt = path_1.default.join(this.prefixPathRoot, `default-image.jpg`);
        this.containermp4 = "mp4";
        this.containerM4A = "M4A";
        this.containerMP3 = "MP3";
        this.containerJPG = "jpg";
        this.DIVIDER_1024 = 1024;
        this.SECONDS = 60;
        this.DIVIDER_AND_FIXED_2 = 2;
        this.PERMITIVE_MINUTES_LONG = 10;
        this.INDEX_START = 0;
        this.MB = "MB";
        this.KBPS = "kbps";
        this.KB128 = "128";
        fluent_ffmpeg_1.default.setFfmpegPath(ffmpeg_static_1.default);
    }
    async getFormatsToDownload(url) {
        try {
            this.videoInfo = await ytdl_core_1.default.getInfo(url);
            this.microformatRenderer =
                this.videoInfo.player_response.microformat.playerMicroformatRenderer;
            const audioOnlyformats = ytdl_core_1.default.filterFormats(this.videoInfo.formats, this.AUDIO_ONLY_FILTER);
            const videoDetails = this.videoInfo.player_response.videoDetails;
            const isLongVideoToDownload = videoDetails.lengthSeconds / this.SECONDS >
                this.PERMITIVE_MINUTES_LONG / this.DIVIDER_AND_FIXED_2;
            const thumbnailFromVideo = this.microformatRenderer.thumbnail.thumbnails[this.INDEX_START].url;
            const formatsCanToDownload = {
                title: this.clearTitle(videoDetails.title, videoDetails.author),
                author: videoDetails.author,
                formats: audioOnlyformats.map((format) => {
                    return {
                        itag: format.itag,
                        type: format.container == this.containermp4
                            ? this.containerM4A
                            : this.containerMP3,
                        size: `${(Number(format.contentLength) /
                            this.DIVIDER_1024 /
                            this.DIVIDER_1024).toFixed(this.DIVIDER_AND_FIXED_2)} ${this.MB}`,
                        quality: `${format.audioBitrate?.toString()} ${this.KBPS}`,
                    };
                }),
                thumbnail: thumbnailFromVideo,
                isSoLong: isLongVideoToDownload ? "1" : "0",
            };
            return formatsCanToDownload;
        }
        catch (error) {
            console.log(error);
            throw new ServerException_1.default(ResponseConstants_1.default.E_SERVER_ERROR_PROCESS_CODE, ConstantsControllers_1.default.HTTP_CODE_SERVER_ERROR, MessagesTranslates_1.default.errorSpawnProcess(Messages_1.default.SPAWN_PROCESS_ERROR), [], error.message);
        }
    }
    async downloadNew(itag, url) {
        try {
            this.videoInfo = await ytdl_core_1.default.getInfo(url);
            const audioOnlyformats = ytdl_core_1.default.filterFormats(this.videoInfo.formats, this.AUDIO_ONLY_FILTER);
            const formatSelected = audioOnlyformats.find((format) => format.itag == itag);
            const videoDetails = this.videoInfo.player_response.videoDetails;
            this.microformatRenderer =
                this.videoInfo.player_response.microformat.playerMicroformatRenderer;
            const titleVideo = this.clearTitle(videoDetails.title, videoDetails.author);
            const yearPublish = this.microformatRenderer.publishDate.substring(0, 4);
            const kbps = formatSelected?.audioBitrate?.toString() ?? this.KB128;
            const pathDownload = path_1.default.join(this.audioPath, `${titleVideo}.${formatSelected?.container}`);
            let thumbnailDownloadPath = path_1.default.join(this.prefixPathRoot, `${titleVideo}.${this.containerJPG}`);
            thumbnailDownloadPath = await this.downloadImage(this.microformatRenderer.thumbnail.thumbnails[0].url, thumbnailDownloadPath);
            const videoDownload = (0, ytdl_core_1.default)(url, {
                filter: (format) => format.itag === itag,
            });
            const pipePromise = new Promise((resolve, reject) => {
                videoDownload
                    .pipe(fs_1.default.createWriteStream(pathDownload))
                    .on("finish", () => {
                    resolve();
                })
                    .on("error", (err) => {
                    reject(err);
                });
            });
            await pipePromise;
            const download = await this.processFinishDownload(pathDownload, titleVideo, kbps, {
                year: yearPublish,
                thumbnailPath: thumbnailDownloadPath,
                author: videoDetails.author,
            });
            return download;
        }
        catch (error) {
            throw new ServerException_1.default(ResponseConstants_1.default.E_SERVER_ERROR_PROCESS_CODE, ConstantsControllers_1.default.HTTP_CODE_SERVER_ERROR, MessagesTranslates_1.default.errorSpawnProcess(Messages_1.default.SPAWN_PROCESS_ERROR), [], error.message);
        }
    }
    async processFinishDownload(filePath, title, audioBitrate, metadata) {
        const convertSong = filePath.includes("mp4")
            ? await this.convertToM4a(filePath, title, audioBitrate)
            : await this.convertToMp3(filePath, title, audioBitrate);
        await this.addMetaData({
            title: title,
            artist: metadata.author,
            year: metadata.year,
            thumbnailPath: metadata.thumbnailPath,
        }, convertSong.path);
        if (metadata.thumbnailPath != this.defaultImageAlbumArt) {
            fs_1.default.unlinkSync(metadata.thumbnailPath);
        }
        return {
            path: convertSong.path,
            url: convertSong.path.split("public/").join(""),
            name: title,
            ext: convertSong.ext,
            thumbnail: this.microformatRenderer.thumbnail.thumbnails[0].url,
        };
    }
    clearTitle(title_video = "unadme_title", author_video = "unadme_author") {
        let clearTitleVideo = title_video;
        for (let word in ConstantsControllers_1.default.wordsRemove) {
            clearTitleVideo = clearTitleVideo
                .replace(word, ConstantsControllers_1.default.wordsRemove[word])
                .trim();
        }
        let clear_author_video = author_video;
        for (let word in ConstantsControllers_1.default.wordsRemove) {
            clear_author_video = clear_author_video
                .replace(word, ConstantsControllers_1.default.wordsRemove[word])
                .trim();
        }
        for (let key in ConstantsControllers_1.default.simbolsForRemove) {
            clearTitleVideo = clearTitleVideo
                .replace(key, ConstantsControllers_1.default.simbolsForRemove[key])
                .trim();
            clear_author_video = clear_author_video
                .replace(key, ConstantsControllers_1.default.simbolsForRemove[key])
                .trim();
        }
        if (clearTitleVideo.includes(author_video)) {
            clearTitleVideo = clearTitleVideo.replace(author_video, "").trim();
        }
        for (let key in ConstantsControllers_1.default.simbolsForRemove) {
            clearTitleVideo = clearTitleVideo
                .replace(key, ConstantsControllers_1.default.simbolsForRemove[key])
                .trim();
            clear_author_video = clear_author_video
                .replace(key, ConstantsControllers_1.default.simbolsForRemove[key])
                .trim();
        }
        let clearTitleStr = (clearTitleVideo.trim() +
            " - " +
            clear_author_video.trim()).trim();
        return clearTitleStr.split("  ").join("");
    }
    async downloadImage(url, path) {
        const client = url.startsWith("https") ? https_1.default : http_1.default;
        const promise = new Promise((resolve) => {
            client.get(url, (response) => {
                response
                    .pipe(fs_1.default.createWriteStream(path))
                    .on("error", () => resolve(this.defaultImageAlbumArt))
                    .on("close", () => {
                    resolve(path);
                });
            });
        });
        return promise;
    }
    async convertToMp3(pathDownload, title, kbps) {
        try {
            const extension = "mp3";
            const promise = new Promise((resolve, reject) => {
                const path = "./public/api/v1/audio/" + title + "." + extension;
                (0, fluent_ffmpeg_1.default)(pathDownload)
                    .output(path)
                    .outputOptions("-acodec", "libmp3lame", "-ab", `${kbps}`)
                    .on("end", async function () {
                    fs_1.default.unlinkSync(pathDownload);
                    resolve({ path: path, ext: extension });
                })
                    .on("error", (err) => {
                    reject(err);
                })
                    .run();
            });
            return promise;
        }
        catch (error) {
            throw new ServerException_1.default(ResponseConstants_1.default.E_SERVER_ERROR_PROCESS_CODE, ConstantsControllers_1.default.HTTP_CODE_SERVER_ERROR, MessagesTranslates_1.default.errorSpawnProcess(Messages_1.default.SPAWN_PROCESS_ERROR), [], error.message);
        }
    }
    async convertToM4a(pathDownload, title, kbps) {
        try {
            const extension = "m4a";
            const promise = new Promise((resolve) => {
                const path = "./public/api/v1/audio/" + title + "." + extension;
                (0, fluent_ffmpeg_1.default)(pathDownload)
                    .output(path)
                    .outputOptions("-acodec", "libmp3lame", "-ab", `${kbps}`)
                    .on("end", async function () {
                    fs_1.default.unlinkSync(pathDownload);
                    resolve({ path: path, ext: extension });
                })
                    .on("error", () => {
                    throw new ServerException_1.default(ResponseConstants_1.default.E_SERVER_ERROR_PROCESS_CODE, ConstantsControllers_1.default.HTTP_CODE_SERVER_ERROR, MessagesTranslates_1.default.errorSpawnProcess(Messages_1.default.SPAWN_PROCESS_ERROR));
                })
                    .run();
            });
            return promise;
        }
        catch (error) {
            throw new ServerException_1.default(ResponseConstants_1.default.E_SERVER_ERROR_PROCESS_CODE, ConstantsControllers_1.default.HTTP_CODE_SERVER_ERROR, MessagesTranslates_1.default.errorSpawnProcess(Messages_1.default.SPAWN_PROCESS_ERROR), [], error.message);
        }
    }
    addMetaData(metaDataInfo, pathAudio) {
        const tags = {
            title: metaDataInfo.title,
            artist: metaDataInfo.artist,
            year: metaDataInfo.year,
            APIC: metaDataInfo.thumbnailPath,
        };
        return node_id3_1.default.Promise.write(tags, pathAudio);
    }
}
exports.default = DownloadMusic;
//# sourceMappingURL=DownloadMusic.js.map