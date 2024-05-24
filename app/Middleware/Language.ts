import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MessagesTranslates from 'App/Language/MessagesTranslates'

export default class Language {
  public async handle({ request }: HttpContextContract, next: () => Promise<void>) {
    MessagesTranslates.language = request.headers().language?.toString() || 'en'
    await next()
  }
}
