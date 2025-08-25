import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MessageManager from 'App/Utils/MessageManager'

export default class Language {
  public async handle({ request }: HttpContextContract, next: () => Promise<void>) {
    const preferedLanguage = request.header('Accept-Language')?.split(',')[0] || 'en'
    request.body().language = preferedLanguage
    MessageManager.language = preferedLanguage
    await next()
  }
}
