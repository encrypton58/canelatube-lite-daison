# importacion de librerias
import pytube
import sys

# variable global de errores
errors = []
limit_minutes_song = 10

simbolsForRemove = {
"""usar para eliminar caracteres especiales"""
    '/': '',
    '//': '',
    '\'': '',
    '\\': '',
    '´':'',
    ':': '',
    '*': '',
    '?': '',
    '"': '',
    '<': '',
    '>': '',
    '_': '',
    '-': '',
    '(' : '',
    ')' : '',
    '&': '',
    '[': '',
    ']': '',
    ';': '',
}

wordsRemove = {
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
    'VÍDEO' : '',
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
    'Audio': '',
    'audio': '',
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
}

def clearTitle(title_video="unadme_title", author_video="unadme_author"):
    """Crea el titulo de la cancion y le remueve los caracteres especiales 
    para que no haya problemas al momento de guardar el archivo

    Args: 
        tite_video (str) : Titulo de la cancion
        author_video (str): Autor de la cancion
    Returns: 
        str clearTitleStr (titulo de la cancion sin caracteres especiales)
"""

    #limpiar titulo de la cancion

    clear_title_video = title_video
    for word in wordsRemove:
        clear_title_video = clear_title_video.replace(word, wordsRemove[word])

    #limpiar autor de la cancion
    clear_author_video = author_video
    for word in wordsRemove:
        clear_author_video = clear_author_video.replace(word, wordsRemove[word])

    for key in simbolsForRemove:
        clear_title_video = clear_title_video.replace(key, simbolsForRemove[key])
        clear_author_video = clear_author_video.replace(key, simbolsForRemove[key])

    if clear_title_video.__contains__(author_video):
        clear_title_video = clear_title_video.replace(author_video, '').strip()

    clearTitleStr = str(clear_title_video.strip() + " - " + clear_author_video.strip())

    return clearTitleStr.strip()

def obtenerFormatos(url: str):
    """Obtiene los formatos de video disponibles
    
        Args:
            url (str): URL del video
        Returns:
            Tuple: Tupla con los formatos de video disponibles
    """
    try:
        videoStream = pytube.YouTube(url)
        titulo = videoStream.title
        autor = videoStream.author

        if (videoStream.length // 60 > limit_minutes_song):
            raise ValueError("La duración maxima de descarga de una canción es de " + str(limit_minutes_song) + " mins")

        #formato json de salida del script
        formatoDescargas = {
            'title': clearTitle(titulo, autor),
            'formats': [],
            'thumbnail': videoStream.thumbnail_url
        }
        #obtiene los formatos de video disponibles
        strems_filtrados = videoStream.streams.filter(only_audio=True)
        for stream in strems_filtrados:
            formatoDelAudio = ('MP3', 'M4A')[stream.mime_type.split('/')[1] == 'mp4']
            formatoDescargas['formats'].append({
                'itag': stream.itag,
                'type': formatoDelAudio,
                'size': str(round(stream.filesize / 1024 / 1024, 2)) + ' MB',
                'quality': stream.abr,
            })
        
        if (videoStream.length // 60 > limit_minutes_song / 2):
            formatoDescargas['is_so_long'] = 1

        return formatoDescargas
    except pytube.exceptions.RegexMatchError:
        errors.append({'rule': 'valid_url', 'field': 'url'})
    except pytube.exceptions.VideoUnavailable:
        errors.append({'rule': 'video_unavailable', 'field': 'url'})
    except ValueError:
        errors.append({'rule': 'video_long', 'field': 'url'})
    except BaseException:
        errors.append({'rule': 'unknown_error', 'field': 'url'})

try:
    formatos = obtenerFormatos(sys.argv[1])
    if(formatos):
        print(formatos)
except IndexError:
    errors.append({'rule': 'required', 'field': 'url'})
finally:
    if errors.__len__() > 0:
        print(errors)
