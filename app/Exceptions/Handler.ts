/*
|--------------------------------------------------------------------------
| Http Exception Handler
|--------------------------------------------------------------------------
|
| AdonisJs will forward all exceptions occurred during an HTTP request to
| the following class. You can learn more about exception handling by
| reading docs.
|
| The exception handler extends a base `HttpExceptionHandler` which is not
| mandatory, however it can do lot of heavy lifting to handle the errors
| properly.
|
*/

import Logger from "@ioc:Adonis/Core/Logger";
import HttpExceptionHandler from "@ioc:Adonis/Core/HttpExceptionHandler";
import ResponseConstantats from "App/Constants/ResponseConstants";
import MessagesTranslates from "App/Language/MessagesTranslates";
import ConstantsControllers from "App/Controllers/ConstantsControllers";

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor() {
    super(Logger);
  }

  public async handle(error, ctx) {
    if (error.message === ResponseConstantats.E_SERVER_ERROR_PROCESS_CODE) {
      return ctx.response
        .status(ConstantsControllers.HTTP_CODE_SERVER_ERROR)
        .json({
          statusCode: ResponseConstantats.STATUS_CODE_ERROR_INTERNAL_SERVER,
          message: error.messageError,
          cause: error.cause,
        });
    }

    if (error.message === ResponseConstantats.E_SCRIPT_ERROR_PROCESS_CODE) {
      return ctx.response
        .status(ConstantsControllers.HTTP_COE_BAD_REQUEST)
        .json({
          statusCode: ResponseConstantats.STATUS_CODE_ERROR_INTERNAL_SERVER,
          message: error.messageError,
          rulesInfo: error.ruleInfo,
        });
    }

    if (error.code === ResponseConstantats.E_SERVER_ERROR_UNKNOWN) {
      return ctx.response
        .status(ConstantsControllers.HTTP_CODE_SERVER_ERROR)
        .json({
          statusCode: ResponseConstantats.STATUS_CODE_ERROR_INTERNAL_SERVER,
          message: error.messageError,
        });
    }

    if (error.code == ResponseConstantats.E_VALIDATION_FAILURE) {
      return ctx.response.status(422).json({
        statusCode: ResponseConstantats.ERROR_UNPROCESSABLE_ENTITY,
        errorsMessages: error.messages,
        message: MessagesTranslates.errorFormatsAvailables(),
      });
    }

    return super.handle(error, ctx);
  }
}
