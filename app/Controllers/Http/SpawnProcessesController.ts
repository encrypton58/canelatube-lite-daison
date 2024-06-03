import fs from "fs/promises";
import DownloadMusic from "./DownloadMusic";

export default class SpawnProcessesController {
  readonly REQUIRED = "required";
  readonly VALID_URL = "valid_url";
  readonly VIDEO_UNAVAILABLE = "video_unavailable";
  readonly VIDEO_LONG = "video_long";
  readonly UNKNOW_ERROR = "unknow_error";
  readonly URL_DOWNLOAD = "downloads/audio/";

  /**
   * Obtiene los formatos disponibles para descargar un video.
   * @param {String} url
   * @returns {Object}
   */
  public async getFormatsToDownload(url: String) {
    const formats = await new DownloadMusic().getFormatsToDownload(
      url.toString()
    );
    return formats;
  }

  public async download(itag: number, url: string) {
    return await new DownloadMusic().downloadNew(itag, url);
  }

  /**
   * Elimina un archivo dada una ruta
   * @param {String} routeFile
   * @returns {Boolean} si se elimino el archivo
   */
  async destroy(routeFile: string): Promise<void> {
    await fs.unlink(routeFile);
  }
}
