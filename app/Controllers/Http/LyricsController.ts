import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import HttpConstants from 'App/Constants/HttpConstants'
import ServerConstants from 'App/Constants/ServerConstants'
import StatusConstanst from 'App/Constants/StatusConstanst'
import BadRequestException from 'App/Exceptions/BadRequestException'
import ErrorResponse from 'App/Models/ErrorResponse'
import MessageManager from 'App/Utils/MessageManager'
import { romanizeLine } from 'App/Utils/Romaji'

export default class LyricsController {
    public async index({ request, response }: HttpContextContract) {
        let lyrics = request.body().lyrics
        if (!lyrics && !this.isLrcFormat(lyrics)) {
            const errorResponse = new ErrorResponse(
                ServerConstants.E_BAD_REQUEST,
                MessageManager.fieldsRequired(),
                HttpConstants.BAD_REQUEST_CODE,
                MessageManager.fieldsRequiredDetails()
            )
            throw new BadRequestException(errorResponse)
        }

        const lines = lyrics.split("\n").map(line => {
            const match = line.match(/^\[(.*?)\]\s*(.*)$/)
            return match ? { time: match[1], text: match[2] } : null
        }).filter(Boolean)

        if (lines.length === 0) {
            const errorResponse = new ErrorResponse(
                ServerConstants.E_BAD_REQUEST,
                MessageManager.contentTypeNotAllowed(),
                HttpConstants.BAD_REQUEST_CODE,
                MessageManager.contentTypeNotAllowedDetails()
            )
            throw new BadRequestException(errorResponse)
        }

        const allText = lines.map((l: { text: string }) => l.text).join("\n")
        const romanizedText = await romanizeLine(allText)

        const romanizedLines = romanizedText.split("\n")

        const lrc = lines.map((line, i) => {
            const txt = romanizedLines[i]?.replace(/\s+/g, ' ').trim() || ''
            return `[${line.time}] ${txt}`
        }).join("\n")

        return response.status(HttpConstants.SUCCESS_CODE).json({
            statusCode: StatusConstanst.SUCCESS_STATUS_CODE,
            message: MessageManager.success(),
            resultSet: {
                lyrics: lrc
            }
        })
    }

    private isLrcFormat(content: string): boolean {
        if (!content) return false
        const lrcRegex = /\[\d{2}:\d{2}(?:\.\d{1,3})?\]/
        return lrcRegex.test(content)
    }

}