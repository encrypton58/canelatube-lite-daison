// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

const spawn = require("child_process").spawnSync;
import Messages from "App/Constants/Messages";
import ResponseConstants from "App/Constants/ResponseConstants";
import ServerException from "App/Exceptions/ServerException";
import MessagesTranslates from "App/Language/MessagesTranslates";
import ErrorModel from "App/Models/ErrorModel";
import path from "path";
import fs from "fs/promises";
import ConstantsControllers from "../ConstantsControllers";
import DetailSong from "App/Models/DetailSong";
import DetailDownload from "App/Models/DetailDownload";
import DownloadMusic from "./DownloadMusic";

const pathf = require("ffmpeg-static");

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
        const formats = await new DownloadMusic().getFormatsToDownload(url.toString())
        return formats
        // const process = spawn("python3", [
        //     path.join(__dirname, "../../scripts/InfoMusic.py"),
        //     url,
        // ]);

        // console.log(pathf);

        // if (process.stderr) {
        //     throw new ServerException(
        //         ResponseConstants.E_SERVER_ERROR_PROCESS_CODE,
        //         ConstantsControllers.HTTP_CODE_SERVER_ERROR,
        //         MessagesTranslates.errorSpawnProcess(Messages.SPAWN_PROCESS_ERROR)
        //     );
        // }
        // if (process.stdout) {
        //     let formats = this.handleFormats(process.stdout);
        //     return formats.data;
        // }
        // throw new ServerException(
        //     ResponseConstants.E_SERVER_ERROR_UNKNOWN,
        //     ConstantsControllers.HTTP_CODE_SERVER_ERROR,
        //     MessagesTranslates.errorSpawnProcess(Messages.SERVER_ERROR_UNKNOWN)
        // );
    }

    public async download(itag: number, url: string) {
        return await new DownloadMusic().download(itag, url)
        // const process = spawn("python3", [
        //     path.join(__dirname, "../../scripts/DownloadMusic.py"),
        //     url,
        //     itag,
        // ]);
        // if (process.error) {
        //     throw new ServerException(
        //         ResponseConstants.E_SERVER_ERROR_PROCESS_CODE,
        //         ConstantsControllers.HTTP_CODE_SERVER_ERROR,
        //         MessagesTranslates.errorSpawnProcess(Messages.SPAWN_PROCESS_ERROR)
        //     );
        // }
        // if (process.stdout) {
        //     const infoDownload = this.handleDownload(process.stdout);
        //     return infoDownload.data;
        // }
        // throw new ServerException(
        //     ResponseConstants.E_SERVER_ERROR_UNKNOWN,
        //     ConstantsControllers.HTTP_CODE_SERVER_ERROR,
        //     MessagesTranslates.errorSpawnProcess(Messages.SERVER_ERROR_UNKNOWN)
        // );
    }

    /**
     * Elimina un archivo dada una ruta
     * @param {String} routeFile
     * @returns {Boolean} si se elimino el archivo
     */
    async destroy(routeFile: string): Promise<boolean> {
        const dir = path.join(__dirname, `../../../public/${this.URL_DOWNLOAD}`);
        const files = await fs.readdir(dir);
        const file = files.find((file) => file === routeFile);
        if (file) {
            await fs.unlink(path.join(dir, file));
            return true;
        }
        return false;
    }

    /**
     * Maneja el flujo de butes de los formatos.
     * @param {Buffer} data
     * @returns {Object}
     */
    private handleFormats(data: Buffer): {
        data: ErrorModel[] | DetailSong;
        hasError: boolean;
    } {
        const dataFlow = this.flowToJson(data.toString());
        if (dataFlow.hasError) {
            if (Array.isArray(dataFlow.data)) {
                const messagesAndRulesInfo = this.getMessageWithErrors(dataFlow.data);
                throw new ServerException(
                    ResponseConstants.E_SCRIPT_ERROR_PROCESS_CODE,
                    ConstantsControllers.HTTP_CODE_SERVER_ERROR,
                    messagesAndRulesInfo.message,
                    this.buildUrlRulesInfo(messagesAndRulesInfo.rulesInfo)
                );
            }
        }
        return dataFlow;
    }

    /**
     * Maneja la promesa de descarga
     * @param {Function} resolve
     * @param {Function} reject
     * @param {process.stdout} data
     */
    handleDownload(data: Buffer) {
        const dataFlow = this.flowToJsonDownload(data.toString());
        if (dataFlow.hasError) {
            if (Array.isArray(dataFlow.data)) {
                const messagesAndRulesInfo = this.getMessageWithErrors(dataFlow.data);
                throw new ServerException(
                    ResponseConstants.E_SCRIPT_ERROR_PROCESS_CODE,
                    ConstantsControllers.HTTP_CODE_SERVER_ERROR,
                    messagesAndRulesInfo.message,
                    this.buildUrlRulesInfo(messagesAndRulesInfo.rulesInfo)
                );
            }
        }
        return dataFlow;
    }

    /**
     * Convierte un flujo de bytes a una estructura json.
     * @param {process.stdout} data
     * @returns {Object}
     */
    private flowToJson(data: string): {
        data: ErrorModel[] | DetailSong;
        hasError: boolean;
    } {
        console.log(data);
        const jsonStructure = JSON.parse("{}") // JSON.parse(data.toString().replace(/'/g, '"'));
        if (!(jsonStructure instanceof Array)) {
            return {
                data: new DetailSong(
                    jsonStructure.title,
                    jsonStructure.formats,
                    jsonStructure.thumbnail,
                    jsonStructure.is_so_long
                ),
                hasError: false,
            };
        }

        return {
            data: jsonStructure.map((error) => {
                return new ErrorModel(error.rule, error.field);
            }),
            hasError: true,
        };
    }

    /**
     * Convierte un flujo de bytes a una estructura json.
     * @param {process.stdout} data
     * @returns {Object}
     */
    private flowToJsonDownload(data: string): {
        data: ErrorModel[] | DetailDownload;
        hasError: boolean;
    } {
        const jsonStructure = JSON.parse(data.toString().replace(/'/g, '"'));
        if (!(jsonStructure instanceof Array)) {
            return {
                data: new DetailDownload(
                    jsonStructure.path,
                    jsonStructure.name,
                    jsonStructure.ext,
                    jsonStructure.size,
                    jsonStructure.image,
                    this.URL_DOWNLOAD.concat(jsonStructure.name).concat(jsonStructure.ext)
                ),
                hasError: false,
            };
        }

        return {
            data: jsonStructure.map((error) => {
                return new ErrorModel(error.rule, error.field);
            }),
            hasError: true,
        };
    }

    /**
     * Obtiene el mensaje de error y las reglas que se violaron.
     * @param errors errores que se generaron en el proceso
     * @returns {Object} mensaje de error y reglas que se violaron
     */
    private getMessageWithErrors(errors: ErrorModel[]): {
        rulesInfo: string[];
        message: string;
    } {
        const rules: string[] = [];

        const messages = errors.map((error) => {
            if (error.rule === this.REQUIRED) {
                rules.push(error.rule);
                return MessagesTranslates.required(error.field);
            }
            if (error.rule === this.VALID_URL) {
                rules.push(error.rule);
                return MessagesTranslates.url(error.field);
            }
            if (error.rule === this.VIDEO_UNAVAILABLE) {
                rules.push(error.rule);
                return MessagesTranslates.errorVideoUnavailable();
            }
            if (error.rule === this.VIDEO_LONG) {
                rules.push(error.rule);
                return MessagesTranslates.errorVideoLong();
            }
            rules.push(error.rule);
            return MessagesTranslates.errorFormatsAvailables();
        });
        return {
            rulesInfo: rules,
            message: MessagesTranslates.formatToMessageError(messages.join(", ")),
        };
    }

    /**
     * Construye un arreglo con las reglas que se violaron.
     * @param rules reglas que se violaron
     * @returns {String[]} reglas que se violaron
     */
    private buildUrlRulesInfo(rules: string[]): string[] {
        return rules.map((rule) => {
            return `infoFromErrors/${rule}`;
        });
    }
}
