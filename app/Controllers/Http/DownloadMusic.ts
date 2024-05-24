
import path from 'path'
import ytdl from 'ytdl-core';
import fs from 'fs';
import ffmpegPath from 'ffmpeg-static';
import ffmpeg from 'fluent-ffmpeg';

export default class DownloadMusic {


    private simbolsForRemove: { [key: string]: string } = {
        '/': '',
        '//': '',
        '\'': '',
        '\\': '',
        '´': '',
        ':': '',
        '*': '',
        '?': '',
        '"': '',
        '<': '',
        '>': '',
        '_': '',
        '-': '',
        '(': '',
        ')': '',
        '&': '',
        '[': '',
        ']': '',
        ';': ''
    };

    private wordsRemove: { [key: string]: string } = {
        'Topic': " ",
        'topic': " ",
        'Official': '',
        'OFFICIAL': '',
        'official': '',
        'Oficial': '',
        'OFICIAL': '',
        'oficial': '',
        'Video': '',
        'video': '',
        'vídeo': '',
        'Vídeo': '',
        'Vídeos': '',
        'vídeos': '',
        'VIDEO': '',
        'VIDEOS': '',
        'VÍDEO': '',
        'Audio': '',
        'audio': '',
        'Lyrics': '',
        'lyrics': '',
        'Lyric': '',
        'lyric': '',
        'música': '',
        'Música': '',
        'Music': '',
        'music': '',
        'Sub Español': '',
        'sub español': '',
        'AMV': '',
        'amv': '',
        'MV': '',
        'mv': '',
        'Prod.': '',
        'prod.': '',
        'Prod': '',
        'prod': '',
        'subtitulado': '',
        'Subtitulado': '',
        'Letra': '',
        'letra': '',
        'letras': '',
        'Letras': '',
        '.mp4': '',
        '.MP4': '',
        '.mp3': '',
        '.MP3': '',
        '.m4a': '',
        '.M4A': '',
        '.mkv': '',
        '.MKV': '',
        '.avi': '',
        '.AVI': '',
        '.flv': '',
        '.FLV': '',
        '.mov': '',
        '.MOV': '',
        '.wmv': '',
        '.WMV': '',
        '.mpeg': '',
        '.MPEG': '',
        '.mpg': '',
        '.MPG': '',
        '.webm': '',
        '.WEBM': '',
        '.ogg': '',
        '.OGG': '',
        '.wav': '',
        '.WAV': '',
        '.aac': '',
        '.AAC': '',
        '.wma': '',
        '.WMA': '',
        '.flac': '',
        '.FLAC': ''
    };


    async getFormatsToDownload(url: string) {
        const info = await ytdl.getInfo(url);
        const formats = ytdl.filterFormats(info.formats, 'audioonly');
        const videoDetails: any = info.player_response.videoDetails;
        const bestThumbnailIndex = videoDetails.thumbnail.thumbnails.length - 1
        const isSoLong = videoDetails.lengthSeconds / 60 > 10 / 2;
        const thumbnail = videoDetails.thumbnail.thumbnails[bestThumbnailIndex].url;
        const formatsOutput = {
            title: info.player_response.videoDetails.title,
            formats: formats.map((format) => {
                return {
                    itag: format.itag,
                    type: (format.mimeType)?.split('/')[1] == 'webm' ? 'mp4' : 'mp3' || 'mp4',
                    size: (Number(format.contentLength) / 1024 / 1024).toFixed(2) + 'MB',
                    quality: format.audioBitrate?.toString() + 'kbps',
                }
            }),
            thumbnail: thumbnail,
            isSoLong: isSoLong ? 'true' : 'false'
        }
        return formatsOutput;

    }

    async download(itag: number, url: string) {
        const info = await ytdl.getInfo(url);
        const formats = ytdl.filterFormats(info.formats, 'audioonly');
        const format = formats.find((format) => format.itag == itag);
        const videoDetails: any = info.player_response.videoDetails;
        const title = videoDetails.title;
        const filePath = path.join(__dirname, `../../../public/downloads/audio/${title}.${format?.container}`);
        const video = ytdl(url, { filter: format => format.itag === itag });
        video.pipe(fs.createWriteStream(filePath)).on('finish', () => {
            this.convertToMp3(filePath, title, format?.audioBitrate || 128);
        });
        return {
            title: title,
            filePath: filePath
        }
    }


    private async convertToMp3(pathDownloadConvert: string, title: string, kbps: number): { path: string } {
        ffmpeg.setFfmpegPath(ffmpegPath);
        const pathDownload = './public/downloads/audio/' + title + '.mp3';
        ffmpeg(pathDownloadConvert)
            .outputOptions(
                '-acodec', 'libmp3lame',
                '-ab', `${kbps}k`,
                '-metadata', 'title="' + title + '"',
                '-metadata', 'artist="Artist Name"',
                '-metadata', 'album="Album Name"',
                '-metadata', 'year=2020',
                '-metadata', 'genre="Genre"',
            )
            .output(pathDownload)
            .on('end', function () {
                fs.unlinkSync(pathDownloadConvert);
            })
            .on('error', function (err: any) {
                console.log('error: ', err);
            }).run();

        return { path: pathDownload };
    }

}