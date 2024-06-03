"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SpawnProcessesController_1 = __importDefault(require("./SpawnProcessesController"));
const ResponseConstants_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Constants/ResponseConstants"));
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const MessagesTranslates_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Language/MessagesTranslates"));
const Song_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Song"));
class MusicController {
    constructor() {
        this.spc = new SpawnProcessesController_1.default();
    }
    async show({ request, response }) {
        const validatorSchema = Validator_1.schema.create({
            url: Validator_1.schema.string({ trim: true }, [Validator_1.rules.url()]),
        });
        const data = await request.validate({
            schema: validatorSchema,
            messages: {
                required: MessagesTranslates_1.default.required("{{ field }}"),
                url: MessagesTranslates_1.default.url("{{ field }}"),
            },
        });
        const formatsAvailables = await this.spc.getFormatsToDownload(data.url);
        if (formatsAvailables.isSoLong == "1") {
            formatsAvailables["warningMessage"] =
                MessagesTranslates_1.default.warningVideoLong();
        }
        return response.status(200).json({
            statusCode: ResponseConstants_1.default.STATUS_CODE_SUCCESS,
            resultSet: formatsAvailables,
            message: MessagesTranslates_1.default.successFormatsAvailables(),
        });
    }
    async create({ request, response }) {
        const validatorSchema = Validator_1.schema.create({
            url: Validator_1.schema.string({ trim: true }, [Validator_1.rules.url()]),
            itag: Validator_1.schema.number(),
        });
        const data = await request.validate({
            schema: validatorSchema,
            messages: {
                required: MessagesTranslates_1.default.required("{{ field }}"),
                url: MessagesTranslates_1.default.url("{{ field }}"),
                number: MessagesTranslates_1.default.number("{{ field }}"),
            },
        });
        const download = await this.spc.download(data.itag, data.url);
        download["url"] = download.url.replace("./api/v1/", "");
        download["id"] = (await Song_1.default.insetSong(download.path)).id;
        return response.status(200).send({
            statusCode: ResponseConstants_1.default.STATUS_CODE_SUCCESS,
            resultSet: download,
            message: MessagesTranslates_1.default.successDownload,
        });
    }
    async destroy({ request, response }) {
        const song = await Song_1.default.selectSong(request.param("id"));
        console.log(song);
        Song_1.default.deletSong(request.param("id"));
        await this.spc.destroy(song.path);
        return response.status(200).json({
            statusCode: ResponseConstants_1.default.STATUS_CODE_SUCCESS,
            message: "success",
            resultSet: {
                isDelete: true,
            },
        });
    }
    async infoFromErrors({ request, response }) {
        const rule = request.param("rule");
        const spc = new SpawnProcessesController_1.default();
        const rules = [];
        if (rule === spc.REQUIRED) {
            rules.push("Debes agregar una url para obtener los formatos disponibles");
            rules.push("Por ahora solo se aceptan urls de youtube");
        }
        if (rule === spc.VALID_URL) {
            rules.push("La url que ingresaste no es válida");
            rules.push("Por favor ingresa una url de youtube");
        }
        if (rule === spc.VIDEO_UNAVAILABLE) {
            rules.push("El video que ingresaste no está disponible");
            rules.push("Por favor ingresa una url de youtube");
        }
        if (rule === spc.VIDEO_LONG) {
            rules.push("El video que ingresaste es muy largo");
            rules.push("el video debe ser menor a 10 minutos");
            rules.push("No debes cerra la app mientras se procesa el video");
        }
        if (rule === spc.UNKNOW_ERROR) {
            rules.push("Ocurrió un error desconocido");
            rules.push("Por favor intenta de nuevo");
        }
        return response.status(200).json({
            statusCode: ResponseConstants_1.default.STATUS_CODE_SUCCESS,
            resultSet: {
                tile: "Puntos importantes de la regla: " + rule,
                rulesInfo: rules,
            },
        });
    }
}
exports.default = MusicController;
//# sourceMappingURL=MusicController.js.map