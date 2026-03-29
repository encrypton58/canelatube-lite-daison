import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
import ErrorResponse from 'App/Models/ErrorResponse';
import ServerConstants from 'App/Constants/ServerConstants';
import MessageManager from 'App/Utils/MessageManager';
import HttpConstants from 'App/Constants/HttpConstants';
import BadRequestException from 'App/Exceptions/BadRequestException';

export default class ApiKeyMiddleware {
  public async handle({ request }: HttpContextContract, next: () => Promise<void>) {
    const apiKey = request.header('x-api-key')
    if (apiKey !== Env.get('ANDROID_APP_KEY')) {
      const errorResponse = new ErrorResponse(
        ServerConstants.E_UNAUTHORIZED,
        MessageManager.unauthorized(),
        HttpConstants.UNAUTHORIZED_CODE,
        MessageManager.unauthorizedDetails()
      );
      throw new BadRequestException(errorResponse);
    }
    await next()
  }
}
