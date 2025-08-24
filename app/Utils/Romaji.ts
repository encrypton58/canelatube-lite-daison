import * as tinyld from "tinyld";
import Kuroshiro from "kuroshiro";
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";
import { romanize as hangulRomanize } from "es-hangul";
import TinyPinyin = require("tiny-pinyin");


const kuroshiro = new Kuroshiro();
let isKuroshiroInitialized = false

async function initKuroshiro() {
    if (!isKuroshiroInitialized) {
        await kuroshiro.init(new KuromojiAnalyzer());
        isKuroshiroInitialized = true;
    }
}

function detectLang(text: string): string {
    const lang = tinyld.detect(text)
    return lang ? lang : "unknown"
}

export async function romanizeLine(line: string): Promise<string> {
    const lang = detectLang(line)

    switch (lang) {
        case "ja": {
            await initKuroshiro()
            return await kuroshiro.convert(line, { to: "romaji", mode: "spaced" })
        }
        case "ko": {
            return hangulRomanize(line);
        }
        case "zh": {
            if (TinyPinyin.isSupported()) {
                return TinyPinyin.convertToPinyin(line, " ", true)
            } else {
                return line
            }
        }
        default:
            return line
    }
}