import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { romanizeLine } from 'App/Utils/Romaji'

export default class LyricsController {
    public async index({ request, response }: HttpContextContract) {
        let lyrics = request.body().lyrics
        if (!lyrics && !this.isLrcFormat(lyrics)) {
            return response.status(400).json({ error: 'Invalid or missing lyrics in LRC format' })
        }

        const lines = lyrics.split("\n").map(line => {
            const match = line.match(/^\[(.*?)\]\s*(.*)$/)
            return match ? { time: match[1], text: match[2] } : null
        }).filter(Boolean)

        if (lines.length === 0) {
            return response.status(400).json({ error: 'Invalid or missing lyrics in LRC format' })
        }

        const allText = lines.map((l: { text: string }) => l.text).join("\n")
        const romanizedText = await romanizeLine(allText)

        const romanizedLines = romanizedText.split("\n")

        const lrc = lines.map((line, i) => {
            const txt = romanizedLines[i]?.replace(/\s+/g, ' ').trim() || ''
            return `[${line.time}] ${txt}`
        }).join("\n")

        return response.status(200).json({
            statusCode: 0,
            message: 'Success',
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