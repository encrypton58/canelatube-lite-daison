import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import SpawnProcessesController from "./SpawnProcessesController";
import ResponseConstants from "App/Constants/ResponseConstants";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import MessagesTranslates from "App/Language/MessagesTranslates";
import Song from "App/Models/Song";

export default class MusicController {
  private spc = new SpawnProcessesController();

  public async show({ request, response }: HttpContextContract) {
    const validatorSchema = schema.create({
      url: schema.string({ trim: true }, [rules.url()]),
    });
    const data = await request.validate({
      schema: validatorSchema,
      messages: {
        required: MessagesTranslates.required("{{ field }}"),
        url: MessagesTranslates.url("{{ field }}"),
      },
    });

    const formatsAvailables = await this.spc.getFormatsToDownload(data.url);

    if (formatsAvailables.isSoLong == "1") {
      formatsAvailables["warningMessage"] =
        MessagesTranslates.warningVideoLong();
    }

    return response.status(200).json({
      statusCode: ResponseConstants.STATUS_CODE_SUCCESS,
      resultSet: formatsAvailables,
      message: MessagesTranslates.successFormatsAvailables(),
    });
  }

  public async create({ request, response }: HttpContextContract) {
    const validatorSchema = schema.create({
      url: schema.string({ trim: true }, [rules.url()]),
      itag: schema.number(),
    });

    const data = await request.validate({
      schema: validatorSchema,
      messages: {
        required: MessagesTranslates.required("{{ field }}"),
        url: MessagesTranslates.url("{{ field }}"),
        number: MessagesTranslates.number("{{ field }}"),
      },
    });

    const download = await this.spc.download(data.itag, data.url);
    download["url"] = download.url.replace("./api/v1/", "");
    download["id"] = (await Song.insetSong(download.path)).id;
    return response.status(200).send({
      statusCode: ResponseConstants.STATUS_CODE_SUCCESS,
      resultSet: download,
      message: MessagesTranslates.successDownload,
    });
  }

  public async destroy({ request, response }: HttpContextContract) {
    const song = await Song.selectSong(request.param("id"));
    console.log(song);
    Song.deletSong(request.param("id"));
    await this.spc.destroy(song.path);
    return response.status(200).json({
      statusCode: ResponseConstants.STATUS_CODE_SUCCESS,
      message: "success",
      resultSet: {
        isDelete: true,
      },
    });
  }

  //TODO: Implementar el método infoFromErrors
  public async infoFromErrors({ request, response }: HttpContextContract) {
    const rule = request.param("rule");
    const spc = new SpawnProcessesController();

    const rules: string[] = [];

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
      statusCode: ResponseConstants.STATUS_CODE_SUCCESS,
      resultSet: {
        tile: "Puntos importantes de la regla: " + rule,
        rulesInfo: rules,
      },
    });
  }
}
