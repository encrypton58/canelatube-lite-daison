import path from "path";
import ytdl from "ytdl-core";
import fs from "fs";
import ffmpegPath from "ffmpeg-static";
import ffmpeg from "fluent-ffmpeg";
import NodeID3 from "node-id3";
import http from "http";
import https from "https";
import ConstantsControllers from "../ConstantsControllers";
import ServerException from "App/Exceptions/ServerException";
import ResponseConstants from "App/Constants/ResponseConstants";
import MessagesTranslates from "App/Language/MessagesTranslates";
import Messages from "App/Constants/Messages";

export default class DownloadMusic {
  //ytdl
  private videoInfo: ytdl.videoInfo;
  private microformatRenderer: ytdl.MicroformatRenderer;
  private readonly AUDIO_ONLY_FILTER = "audioonly";

  //paths
  private readonly prefixPathRoot = path.join(
    __dirname,
    "../../../public/api/v1/"
  );
  private readonly audioPath = path.join(this.prefixPathRoot, "audio/");
  private readonly defaultImageAlbumArt: string = path.join(
    this.prefixPathRoot,
    `default-image.jpg`
  );

  //Continer formats
  private readonly containermp4 = "mp4";
  private readonly containerM4A = "M4A";
  private readonly containerMP3 = "MP3";
  private readonly containerJPG = "jpg";

  //Dividers
  private readonly DIVIDER_1024 = 1024;
  private readonly SECONDS = 60;
  private readonly DIVIDER_AND_FIXED_2 = 2;
  private readonly PERMITIVE_MINUTES_LONG = 10;
  private readonly INDEX_START = 0;

  //unit size
  private readonly MB = "MB";
  private readonly KBPS = "kbps";
  private readonly KB128 = "128";

  constructor() {
    ffmpeg.setFfmpegPath(ffmpegPath);
  }

  async getFormatsToDownload(url: string) {
    try {
      this.videoInfo = await ytdl.getInfo(url);
      this.microformatRenderer =
        this.videoInfo.player_response.microformat.playerMicroformatRenderer;
      const audioOnlyformats = ytdl.filterFormats(
        this.videoInfo.formats,
        this.AUDIO_ONLY_FILTER
      );
      const videoDetails: any = this.videoInfo.player_response.videoDetails;
      const isLongVideoToDownload =
        videoDetails.lengthSeconds / this.SECONDS >
        this.PERMITIVE_MINUTES_LONG / this.DIVIDER_AND_FIXED_2;
      const thumbnailFromVideo =
        this.microformatRenderer.thumbnail.thumbnails[this.INDEX_START].url;
      const formatsCanToDownload = {
        title: this.clearTitle(videoDetails.title, videoDetails.author),
        author: videoDetails.author,
        formats: audioOnlyformats.map((format) => {
          return {
            itag: format.itag,
            type:
              format.container == this.containermp4
                ? this.containerM4A
                : this.containerMP3,
            size: `${(
              Number(format.contentLength) /
              this.DIVIDER_1024 /
              this.DIVIDER_1024
            ).toFixed(this.DIVIDER_AND_FIXED_2)} ${this.MB}`,
            quality: `${format.audioBitrate?.toString()} ${this.KBPS}`,
          };
        }),
        thumbnail: thumbnailFromVideo,
        isSoLong: isLongVideoToDownload ? "1" : "0",
      };
      return formatsCanToDownload;
    } catch (error) {
      console.log(error);
      throw new ServerException(
        ResponseConstants.E_SERVER_ERROR_PROCESS_CODE,
        ConstantsControllers.HTTP_CODE_SERVER_ERROR,
        MessagesTranslates.errorSpawnProcess(Messages.SPAWN_PROCESS_ERROR),
        [],
        error.message
      );
    }
  }

  async downloadNew(itag: number, url: string) {
    try {
      this.videoInfo = await ytdl.getInfo(url);
      const audioOnlyformats = ytdl.filterFormats(
        this.videoInfo.formats,
        this.AUDIO_ONLY_FILTER
      );
      const formatSelected = audioOnlyformats.find(
        (format) => format.itag == itag
      );
      const videoDetails = this.videoInfo.player_response.videoDetails;
      this.microformatRenderer =
        this.videoInfo.player_response.microformat.playerMicroformatRenderer;
      const titleVideo = this.clearTitle(
        videoDetails.title,
        videoDetails.author
      );
      const yearPublish = this.microformatRenderer.publishDate.substring(0, 4);
      const kbps = formatSelected?.audioBitrate?.toString() ?? this.KB128;
      const pathDownload = path.join(
        this.audioPath,
        `${titleVideo}.${formatSelected?.container}`
      );
      let thumbnailDownloadPath = path.join(
        this.prefixPathRoot,
        `${titleVideo}.${this.containerJPG}`
      );
      thumbnailDownloadPath = await this.downloadImage(
        this.microformatRenderer.thumbnail.thumbnails[0].url,
        thumbnailDownloadPath
      );

      const videoDownload = ytdl(url, {
        filter: (format) => format.itag === itag,
      });
      const pipePromise = new Promise<void>((resolve, reject) => {
        videoDownload
          .pipe(fs.createWriteStream(pathDownload))
          .on("finish", () => {
            resolve();
          })
          .on("error", (err) => {
            reject(err);
          });
      });

      await pipePromise;

      const download = await this.processFinishDownload(
        pathDownload,
        titleVideo,
        kbps,
        {
          year: yearPublish,
          thumbnailPath: thumbnailDownloadPath,
          author: videoDetails.author,
        }
      );

      return download;
    } catch (error) {
      throw new ServerException(
        ResponseConstants.E_SERVER_ERROR_PROCESS_CODE,
        ConstantsControllers.HTTP_CODE_SERVER_ERROR,
        MessagesTranslates.errorSpawnProcess(Messages.SPAWN_PROCESS_ERROR),
        [],
        error.message
      );
    }
  }

  async processFinishDownload(
    filePath: string,
    title: string,
    audioBitrate: string,
    metadata: {
      author: string;
      year: string;
      thumbnailPath: string;
    }
  ) {
    const convertSong = filePath.includes("mp4")
      ? await this.convertToM4a(filePath, title, audioBitrate)
      : await this.convertToMp3(filePath, title, audioBitrate);

    await this.addMetaData(
      {
        title: title,
        artist: metadata.author,
        year: metadata.year,
        thumbnailPath: metadata.thumbnailPath,
      },
      convertSong.path
    );

    if (metadata.thumbnailPath != this.defaultImageAlbumArt) {
      fs.unlinkSync(metadata.thumbnailPath);
    }

    return {
      path: convertSong.path,
      url: convertSong.path.split("public/").join(""),
      name: title,
      ext: convertSong.ext,
      thumbnail: this.microformatRenderer.thumbnail.thumbnails[0].url,
    };
  }

  // ----------------- Private Methods ---------------- //

  private clearTitle(
    title_video: string = "unadme_title",
    author_video: string = "unadme_author"
  ): string {
    let clearTitleVideo: string = title_video;
    for (let word in ConstantsControllers.wordsRemove) {
      clearTitleVideo = clearTitleVideo
        .replace(word, ConstantsControllers.wordsRemove[word])
        .trim();
    }
    let clear_author_video: string = author_video;
    for (let word in ConstantsControllers.wordsRemove) {
      clear_author_video = clear_author_video
        .replace(word, ConstantsControllers.wordsRemove[word])
        .trim();
    }

    for (let key in ConstantsControllers.simbolsForRemove) {
      clearTitleVideo = clearTitleVideo
        .replace(key, ConstantsControllers.simbolsForRemove[key])
        .trim();
      clear_author_video = clear_author_video
        .replace(key, ConstantsControllers.simbolsForRemove[key])
        .trim();
    }

    if (clearTitleVideo.includes(author_video)) {
      clearTitleVideo = clearTitleVideo.replace(author_video, "").trim();
    }

    for (let key in ConstantsControllers.simbolsForRemove) {
      clearTitleVideo = clearTitleVideo
        .replace(key, ConstantsControllers.simbolsForRemove[key])
        .trim();
      clear_author_video = clear_author_video
        .replace(key, ConstantsControllers.simbolsForRemove[key])
        .trim();
    }

    let clearTitleStr: string = (
      clearTitleVideo.trim() +
      " - " +
      clear_author_video.trim()
    ).trim();
    return clearTitleStr.split("  ").join("");
  }

  private async downloadImage(url: string, path: string): Promise<string> {
    const client = url.startsWith("https") ? https : http;
    const promise = new Promise<string>((resolve) => {
      client.get(url, (response) => {
        response
          .pipe(fs.createWriteStream(path))
          .on("error", () => resolve(this.defaultImageAlbumArt))
          .on("close", () => {
            resolve(path);
          });
      });
    });
    return promise;
  }

  private async convertToMp3(
    pathDownload: string,
    title: string,
    kbps: string
  ): Promise<{ path: string; ext: string }> {
    try {
      const extension = "mp3";
      const promise = new Promise<{ path: string; ext: string }>(
        (resolve, reject) => {
          const path = "./public/api/v1/audio/" + title + "." + extension;
          ffmpeg(pathDownload)
            .output(path)
            .outputOptions("-acodec", "libmp3lame", "-ab", `${kbps}`)
            .on("end", async function () {
              fs.unlinkSync(pathDownload);
              resolve({ path: path, ext: extension });
            })
            .on("error", (err) => {
              reject(err);
            })
            .run();
        }
      );
      return promise;
    } catch (error) {
      throw new ServerException(
        ResponseConstants.E_SERVER_ERROR_PROCESS_CODE,
        ConstantsControllers.HTTP_CODE_SERVER_ERROR,
        MessagesTranslates.errorSpawnProcess(Messages.SPAWN_PROCESS_ERROR),
        [],
        error.message
      );
    }
  }

  private async convertToM4a(
    pathDownload: string,
    title: string,
    kbps: string
  ): Promise<{ path: string; ext: string }> {
    try {
      const extension = "m4a";
      const promise = new Promise<{ path: string; ext: string }>((resolve) => {
        const path = "./public/api/v1/audio/" + title + "." + extension;
        ffmpeg(pathDownload)
          .output(path)
          .outputOptions("-acodec", "libmp3lame", "-ab", `${kbps}`)
          .on("end", async function () {
            fs.unlinkSync(pathDownload);
            resolve({ path: path, ext: extension });
          })
          .on("error", () => {
            throw new ServerException(
              ResponseConstants.E_SERVER_ERROR_PROCESS_CODE,
              ConstantsControllers.HTTP_CODE_SERVER_ERROR,
              MessagesTranslates.errorSpawnProcess(Messages.SPAWN_PROCESS_ERROR)
            );
          })
          .run();
      });
      return promise;
    } catch (error) {
      throw new ServerException(
        ResponseConstants.E_SERVER_ERROR_PROCESS_CODE,
        ConstantsControllers.HTTP_CODE_SERVER_ERROR,
        MessagesTranslates.errorSpawnProcess(Messages.SPAWN_PROCESS_ERROR),
        [],
        error.message
      );
    }
  }

  private addMetaData(
    metaDataInfo: {
      title: string;
      artist: string;
      year: string;
      thumbnailPath: string;
    },
    pathAudio: string
  ) {
    const tags = {
      title: metaDataInfo.title,
      artist: metaDataInfo.artist,
      year: metaDataInfo.year,
      APIC: metaDataInfo.thumbnailPath,
    };
    return NodeID3.Promise.write(tags, pathAudio);
  }
}
