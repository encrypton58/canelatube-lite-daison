import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import HttpConstants from 'App/Constants/HttpConstants'
import ServerConstants from 'App/Constants/ServerConstants'
import StatusConstanst from 'App/Constants/StatusConstanst'
import BadRequestException from 'App/Exceptions/BadRequestException'
import ErrorResponse from 'App/Models/ErrorResponse'
import MessageManager from 'App/Utils/MessageManager'
import { schema } from '@ioc:Adonis/Core/Validator'
import { romanizeLine } from 'App/Utils/Romaji'

export default class LyricsController {
    public async index({ request, response }: HttpContextContract) {
        const payload = await request.validate({
            schema: schema.create({
                isSync: schema.boolean(),
                lyrics: schema.string({ trim: true, escape: true }),
            }),
            messages: {
                required: MessageManager.required('{{field}}')
            }
        });

        const { isSync, lyrics } = payload;

        if (isSync) {
            if (!this.isLrcFormat(lyrics)) {
                return this.badRequest();
            }

            const lines = this.parseLrcLines(lyrics);
            if (!lines.length) {
                return this.badRequest();
            }

            const romanized = await romanizeLine(lines.map(l => l.text).join('\n'));
            const romanizedLines = romanized.split('\n');

            const lrc = lines.map((line, i) =>
                `[${line.time}] ${romanizedLines[i]?.replace(/\s+/g, ' ').trim() || ''}`
            ).join('\n');

            return response.status(HttpConstants.SUCCESS_CODE).json({
                statusCode: StatusConstanst.SUCCESS_STATUS_CODE,
                message: MessageManager.success(),
                resultSet: { lyrics: lrc },
            });
        }

        // Not sync, just romanize the whole text
        const romanizedText = await romanizeLine(lyrics);
        return response.status(HttpConstants.SUCCESS_CODE).json({
            statusCode: StatusConstanst.SUCCESS_STATUS_CODE,
            message: MessageManager.success(),
            resultSet: { lyrics: romanizedText },
        });
    }

    private isLrcFormat(content: string): boolean {
        return !!content && /\[\d{2}:\d{2}(?:\.\d{1,3})?\]/.test(content);
    }

    private parseLrcLines(lyrics: string) {
        return lyrics.split('\n').reduce<{ time: string; text: string }[]>((acc, line) => {
            const match = line.match(/^\[(.*?)\]\s*(.*)$/);
            if (match) acc.push({ time: match[1], text: match[2] });
            return acc;
        }, []);
    }

    private badRequest() {
        const errorResponse = new ErrorResponse(
            ServerConstants.E_BAD_REQUEST,
            MessageManager.contentTypeNotAllowed(),
            HttpConstants.BAD_REQUEST_CODE,
            MessageManager.contentTypeNotAllowedDetails()
        );
        throw new BadRequestException(errorResponse);
    }
}
