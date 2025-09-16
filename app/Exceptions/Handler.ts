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
import HttpConstants from "App/Constants/HttpConstants";
import ServerConstants from "App/Constants/ServerConstants";
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from "./BadRequestException";
import ErrorResponse from "App/Models/ErrorResponse";
import MessageManager from "App/Utils/MessageManager";
import ErrorMoreDetail from "App/Models/ErrorMoreDetail";
import ErrorDetailModel from "App/Models/ErrorDetailModel";

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor() {
    super(Logger);
  }

  public async handle(error: any, ctx: HttpContextContract) {

    if (error.code == ServerConstants.E_BAD_REQUEST) {
      return ctx.response.status(HttpConstants.BAD_REQUEST_CODE).json(
        (error as BadRequestException).errorResponse
      )
    }

    if (ctx.response.getStatus() == HttpConstants.UNPROCESSABLE_ENTITY_CODE_HTTP) {
      const errorResponse = new ErrorResponse(
        ServerConstants.E_FIELDS_REQUIRED_CODE,
        MessageManager.fieldsRequired(),
        ctx.response.getStatus(),
        MessageManager.fieldsRequiredDetails())
      return ctx.response.status(HttpConstants.UNPROCESSABLE_ENTITY_CODE_HTTP).json(errorResponse)
    }

    return super.handle(error, ctx);
  }
}
