const path = require("path");
const ServerException = require("../../Exceptions/ServerException");
const ErrorModel = require("../../models/ErrorModel");
const spawn = require("child_process").spawnSync;
const fs = require("fs/promises");
const {
  serverMessages,
  showMessages,
  parseMessages,
} = require("../../constants/Messages");

/**
 * Clase para Spawns de procesos
 */
class SpawProcessController {
  static instance = null;
  /**
   * Conjunto de directorios donde se almacenan los archivos de sonido
   */
  resolvePathArray = ["..", "..", "public", "downloads", "audio"];

  constructor() {}

  /**
   * Obtiene la instancia de la clase que spawnea procesos
   * @returns {SpawProcessController}
   */
  static getInstance() {
    if (!this.instance) {
      this.instance = new SpawProcessController();
    }
    return this.instance;
  }

  /**
   * Devuelve los formatos a los que puede descargar la cancion solicitada
   * @param {String} url
   * @returns data
   */
  getFormatsDownload(url) {
    const process = spawn("python3", [
      path.join(__dirname, "InfoMusic.py"),
      url,
    ]);
    let promiseFormats = null;

    if (process.error) {
      throw new ServerException(
        serverMessages.CANT_SERVER_RUN_SCRIPT,
        this.buildSeverException(process.error)
      );
    }

    if (process.stdout) {
      promiseFormats = new Promise((resolve, reject) => {
        this.handleFormats(resolve, reject, process.stdout);
      });
      return promiseFormats;
    }
    throw new ServerException(
      showMessages.UNDEFINED_SPAW_PROCCESS_ERROR,
      serverMessages.SERVER_UNDEFINED_BECAUSE_ERROR
    );
  }

  /**
   * Descarga la cancion al servidor
   * @param {Number} itag
   * @param {String} url
   * @returns data
   */
  async downloadSong(itag, url) {
    const process = spawn("python3", [
      path.join(__dirname, "DownloadMusic.py"),
      url,
      itag,
    ]);
    if (process.error) {
      throw new ServerException(
        serverMessages.CANT_SEVER_RUN_DOWNLOAD_SCRIPT,
        this.buildSeverException(process.error)
      );
    }

    if (process.stdout) {
      const promise = new Promise((resolve, reject) => {
        this.handleDownload(resolve, reject, process.stdout);
      });
      return promise;
    }
    throw new ServerException(
      parseMessages.UNDEFINE_SPAW_PROCESS_ERROR,
      serverMessages.SERVER_UNDEFINED_BECAUSE_ERROR
    );
  }

  /**
   * Elimina un archivo dada una ruta
   * @param {String} routeFile
   * @returns {Boolean} si se elimino el archivo
   */
  async destroy(routeFile) {
    await fs.unlink(routeFile).catch((e) => {
      console.log(e);
    });
    return true;
  }

  /**
   * Elimina la carpeta encargada de almacenar el audio
   * y la recrea al finalizar el proceso
   */
  async destroyAll() {
    const audio_path = path.resolve(__dirname, ...this.resolvePathArray);
    await fs.rmdir(audio_path, { recursive: true }).catch((e) => {
      console.log(e);
    });
    fs.mkdir(audio_path);
  }

  /**
   * Maneja la promesa de los formatos de descarga
   * @param {Function} resolve
   * @param {Function} reject
   * @param {process.stdout} data
   */
  handleFormats(resolve, reject, data) {
    const json = this.flowToJson(data.toString());
    if (json instanceof Array) {
      reject(json);
    } else {
      resolve(json);
    }
  }

  /**
   * Maneja la promesa de descarga
   * @param {Function} resolve
   * @param {Function} reject
   * @param {process.stdout} data
   */
  handleDownload(resolve, reject, data) {
    const json = this.flowToJson(data);
    if (json instanceof Array) {
      reject(json);
    } else {
      resolve(json);
    }
  }

  /**
   * Convierte un flujo de bytes a una estructura json
   * @param {process.stdout} data
   * @returns jsonData
   */
  flowToJson(data) {
    const jsonData = JSON.parse(data.toString().replace(/'/g, '"'));
    if (jsonData instanceof Array) {
      return jsonData.map((error) => {
        return ErrorModel(error.rule, error.field, error.message);
      });
    } else {
      return jsonData;
    }
  }

  /**
   * Construye el mensaje de error de ServerException
   * @param {Error} error
   * @returns
   */
  buildSeverException(error) {
    const data = error.code + " - " + error.syscall;
    return data;
  }
}

module.exports = SpawProcessController;
