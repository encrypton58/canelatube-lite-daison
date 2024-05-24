import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import SpawnProcessesController from "./SpawnProcessesController";
import ResponseConstants from "App/Constants/ResponseConstants";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import MessagesTranslates from "App/Language/MessagesTranslates";

export default class MusicController {

    private spc = new SpawnProcessesController()

    public async show({ request, response }: HttpContextContract) {
        const validatorSchema = schema.create({
            url: schema.string({ trim: true }, [rules.url()]),
        });
        const data = await request.validate({
            schema: validatorSchema,
            messages: {
                required: MessagesTranslates.required("{{ field }}"),
                url: MessagesTranslates.url("{{ field }}"),
            }
        });

        const formatsAvailables =
            await this.spc.getFormatsToDownload(data.url);

        return response.status(200).json({
            statusCode: ResponseConstants.STATUS_CODE_SUCCESS,
            resultSet: formatsAvailables,
            message: MessagesTranslates.successFormatsAvailables(),
        });
    }

    public async create({ request, response }: HttpContextContract) {
        const validatorSchema = schema.create({
            url: schema.string({ trim: true }, [rules.url()]),
            itag: schema.number()
        });

        const data = await request.validate({
            schema: validatorSchema,
            messages: {
                required: MessagesTranslates.required("{{ field }}"),
                url: MessagesTranslates.url("{{ field }}"),
                number: MessagesTranslates.number("{{ field }}"),
            }
        });

        const downloadData = await this.spc.download(data.itag, data.url);
        return response.status(200).json({
            statusCode: ResponseConstants.STATUS_CODE_SUCCESS,
            resultSet: downloadData,
            message: MessagesTranslates.successDownload,
        });
    }

    public async destroy({ request, response }: HttpContextContract) {
        const validatorSchema = schema.create({
            name: schema.string({ trim: true }),
        });
        const data = await request.validate({
            schema: validatorSchema,
            messages: {
                required: MessagesTranslates.required("{{ field }}"),
            }
        });
        const isDestroy = await this.spc.destroy(data.name);
        if (isDestroy) {
            return response.status(200).json({
                statusCode: ResponseConstants.STATUS_CODE_SUCCESS,
                message: "success",
            });
        } else {
            return response.status(200).json({
                statusCode: ResponseConstants.STATUS_CODE_SUCCESS,
                message: "error",
            });
        }
    }

    //TODO: Implementar el método infoFromErrors
    public async infoFromErrors({ request, response }: HttpContextContract) {
        const rule = request.param("rule");
        const spc = new SpawnProcessesController()

        const rules: string[] = []

        if (rule === spc.REQUIRED) {
            rules.push("Debes agregar una url para obtener los formatos disponibles")
            rules.push("Por ahora solo se aceptan urls de youtube")
        }

        if (rule === spc.VALID_URL) {
            rules.push("La url que ingresaste no es válida")
            rules.push("Por favor ingresa una url de youtube")
        }

        if (rule === spc.VIDEO_UNAVAILABLE) {
            rules.push("El video que ingresaste no está disponible")
            rules.push("Por favor ingresa una url de youtube")
        }

        if (rule === spc.VIDEO_LONG) {
            rules.push("El video que ingresaste es muy largo")
            rules.push("el video debe ser menor a 10 minutos")
            rules.push("No debes cerra la app mientras se procesa el video")
        }

        if (rule === spc.UNKNOW_ERROR) {
            rules.push("Ocurrió un error desconocido")
            rules.push("Por favor intenta de nuevo")
        }


        return response.status(200).json({
            statusCode: ResponseConstants.STATUS_CODE_SUCCESS,
            resultSet: {
                tile: "Puntos importantes de la regla: " + rule,
                rulesInfo: rules
            },
        });

    }

}
