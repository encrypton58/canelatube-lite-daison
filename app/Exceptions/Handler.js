"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Logger"));
const HttpExceptionHandler_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/HttpExceptionHandler"));
const ResponseConstants_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Constants/ResponseConstants"));
const MessagesTranslates_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Language/MessagesTranslates"));
const ConstantsControllers_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Controllers/ConstantsControllers"));
class ExceptionHandler extends HttpExceptionHandler_1.default {
    constructor() {
        super(Logger_1.default);
    }
    async handle(error, ctx) {
        if (error.message === ResponseConstants_1.default.E_SERVER_ERROR_PROCESS_CODE) {
            return ctx.response
                .status(ConstantsControllers_1.default.HTTP_CODE_SERVER_ERROR)
                .json({
                statusCode: ResponseConstants_1.default.STATUS_CODE_ERROR_INTERNAL_SERVER,
                message: error.messageError,
                cause: error.cause,
            });
        }
        if (error.message === ResponseConstants_1.default.E_SCRIPT_ERROR_PROCESS_CODE) {
            return ctx.response
                .status(ConstantsControllers_1.default.HTTP_COE_BAD_REQUEST)
                .json({
                statusCode: ResponseConstants_1.default.STATUS_CODE_ERROR_INTERNAL_SERVER,
                message: error.messageError,
                rulesInfo: error.ruleInfo,
            });
        }
        if (error.code === ResponseConstants_1.default.E_SERVER_ERROR_UNKNOWN) {
            return ctx.response
                .status(ConstantsControllers_1.default.HTTP_CODE_SERVER_ERROR)
                .json({
                statusCode: ResponseConstants_1.default.STATUS_CODE_ERROR_INTERNAL_SERVER,
                message: error.messageError,
            });
        }
        if (error.code == ResponseConstants_1.default.E_VALIDATION_FAILURE) {
            return ctx.response.status(422).json({
                statusCode: ResponseConstants_1.default.ERROR_UNPROCESSABLE_ENTITY,
                errorsMessages: error.messages,
                message: MessagesTranslates_1.default.errorFormatsAvailables(),
            });
        }
        return super.handle(error, ctx);
    }
}
exports.default = ExceptionHandler;
//# sourceMappingURL=Handler.js.map