from random import randint
import subprocess
import requests
import datetime
import tarfile
from mutagen.easyid3 import EasyID3
from mutagen.mp4 import MP4, MP4Cover
from mutagen.id3 import ID3, APIC
import pytube
import sys
import os

"""Rutas padre y de carpeta archivos temporales"""
root_path = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)).split('controllers')[0])) + '/'
images_path = root_path + 'public/downloads/images/'
audio_path = root_path + 'public/downloads/audio/'
ffmpeg_path = "/tmp/ffmpeg-6.0-amd64-static/ffmpeg"

def get_path_ffmpeg_or_download():
    """Verifica si existe ffmpeg si no es asi lo descarga"""
    global ffmpeg_path
    ffmpeg_path = sys.argv[3]
    if not os.path.exists(ffmpeg_path):
        download_ffmpeg = "https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz"
        ffmpeg_name = "/tmp/ffmpeg.tar.xz"
        response = requests.get(download_ffmpeg)
        open(ffmpeg_name, 'wb').write(response.content)
        tar_ffmpeg = tarfile.open(ffmpeg_name)
        name_member_ffmpeg = tar_ffmpeg.getmembers()[0].name
        tar_ffmpeg.extractall("/tmp")
        subprocess.run(["rm", ffmpeg_name])            
        ffmpeg_path = r"/tmp/"+name_member_ffmpeg+"/ffmpeg"

"""Globales para el script"""
errors = []
errors_causes = []
nombreImagenTmp = 'tmp_image' + str(randint(0, 10000))
global rutaSalida 
rutaSalida = ""
kbps_file = ""

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
        clear_title_video = clear_title_video.replace(word, wordsRemove[word]).strip()

    #limpiar autor de la cancion
    clear_author_video = author_video
    for word in wordsRemove:
        clear_author_video = clear_author_video.replace(word, wordsRemove[word]).strip()

    for key in simbolsForRemove:
        clear_title_video = clear_title_video.replace(key, simbolsForRemove[key]).strip()
        clear_author_video = clear_author_video.replace(key, simbolsForRemove[key]).strip()


    if clear_title_video.__contains__(author_video):
        clear_title_video = clear_title_video.replace(author_video, '').strip()

    clearTitleStr = str(clear_title_video.strip() + " - " + clear_author_video.strip()).strip()
    return clearTitleStr.strip()


def on_complete(stream, path):
    """Callback para cuando se completa la descarga del video"""
    rutaSalida = path
    if not path.endswith('.mp4'):
        rutaSalida = convertirMp3(path)
    else:
        rutaSalida = convertirToM4a(path)
    agregarMetadata(rutaSalida)
    print(crearJsonSalida(rutaSalida))

def convertirMp3(path: str):
    """Convierte el archivo mp4 a mp3
    
        Args:
            path (str): Ruta del archivo a convertir
        Returns:
            str: Ruta del archivo mp3
        """
    ultimoPunto = path.rfind('.')
    rutaTemporal = path[:ultimoPunto] + '.mp3'
    subprocess.run([ffmpeg_path, '-i', path, '-acodec', 'libmp3lame', '-ab', kbps_file , '-y', rutaTemporal], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    subprocess.run(['rm', path])
    return rutaTemporal

def convertirToM4a(path: str):
    ultimoPuunto = path.rfind('.')
    rutaTemporal = path[:ultimoPuunto] + '.m4a'
    subprocess.run([ffmpeg_path, '-i', path, '-map', '0:a', '-c', 'copy', '-y', rutaTemporal], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    subprocess.run(['rm', path])
    return rutaTemporal

def descargarImagen(image_url = ""):
    """Descarga la imagen de la cancion y la guarda en la carpeta images
        Args:
            image_url (str): Url de la imagen"""
    image = requests.get(image_url).content
    with open(images_path + nombreImagenTmp + '.jpg', 'wb') as handler:
        handler.write(image)

def agregarMetadata(ruta: str):
    """Agrega la metadata a la cancion
    Args: 
        ruta (str): Ruta del archivo a agregar la metadata
    """
    if ruta.endswith('.mp3'):
        tags = EasyID3(ruta)
        if tags is None:
            tag = EasyID3()
            tag['title'] = video.title
            tag['artist'] = video.author
            tag.save(ruta)
            tags = ID3(ruta)
            with open(images_path + nombreImagenTmp + '.jpg', 'rb') as handler:
                tags['APIC'] = APIC(ncoding=3,
                    mime='image/jpeg',
                    type=3,
                    desc=u'Cover',
                    data=handler.read())
            tags.save()
        else:
            tags['title'] = video.title
            tags['artist'] = video.author
            tags.save()
            tags = ID3(ruta)
            with open(images_path + nombreImagenTmp + '.jpg', 'rb') as handler:
                tags['APIC'] = APIC(ncoding=3,
                    mime='image/jpeg',
                    type=3,
                    desc=u'Cover',
                    data=handler.read())
            tags.save()
    
    else:
        mp4 = MP4(ruta)
        if mp4.tags is None:
            mp4.add_tags()
            mp4["\xa9nam"] = video.title
            mp4["\xa9ART"] = video.author
            mp4.save()
            mp4 = MP4(ruta)
            with open(images_path + nombreImagenTmp + '.jpg', 'rb') as handler:
               with open(images_path + nombreImagenTmp + '.jpg', 'rb') as handler:
                mp4['covr'] = [MP4Cover(handler.read(), imageformat=MP4Cover.FORMAT_JPEG)]
            mp4.save()
        else:
            mp4.tags['title'] = video.title
            mp4.tags['artist'] = video.author
            mp4.save()
            mp4 = MP4(ruta)
            with open(images_path + nombreImagenTmp + '.jpg', 'rb') as handler:
                mp4['covr'] = [MP4Cover(handler.read(), imageformat=MP4Cover.FORMAT_JPEG)]
            mp4.save()
    subprocess.run(['rm', images_path + nombreImagenTmp +  '.jpg'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

def crearJsonSalida(rutaSalida: str):
    """Crea el json de salida para la aplicacion
    Args:
        rutaSalida (str): Ruta del archivo de salida
    Returns:
        str: Json de salida
    """
    return {
        'path': rutaSalida,
        'name': clearTitle(video.title, video.author),
        'ext': rutaSalida[rutaSalida.rfind('.'):],
        'size': str(round(os.path.getsize(rutaSalida) / 1024 / 1024, 2)) + ' MB',
        'image': video.thumbnail_url
    }
    
def init(): 
    """Funcion principal"""
    try:
        global video
        video = pytube.YouTube(sys.argv[1], on_complete_callback=on_complete)
    except IndexError as e:
        errors_causes.append({'parent':"IndexError", 'value': e.__str__()})
        errors.append({'rule': 'url', 'message': 'No se ha enviado la url', 'field': 'url'})
    except pytube.exceptions.RegexMatchError as e:
        video = None
        errors_causes.append({'parent':"RegexMatch", 'value': e.__str__()})
        errors.append({'rule': 'valid_url', 'message': 'No es una url válida', 'field': 'url'})
    except pytube.exceptions.VideoUnavailable as e:
        errors_causes.append({'parent':"VideoUnavailable", 'value': e.__str__()})
        errors.append({'rule': 'yt_url', 'message': "No se encontró el video o no es una url descargable", 'field': 'url'})
    except BaseException as e:
        errors_causes.append({'parent':"VideoUnavailable", 'value': e.__str__()})
        errors.append({'message': "Ocurrió un error que no se esperaba", 'field': 'script_error_py'})

"""Crea un archivo txt con el error en cuestion"""
def log_error():
    error_write = ""
    for error in errors_causes:
        error_write += f'Cached in: "{error["parent"]}"\n'
        error_write += f'Because Error: "{error["value"]}"\n'
        error_write += f'Data: Url="{sys.argv[1]}", Itag="{sys.argv[2]}"\n'
        error_write += f'Date: {datetime.datetime.now().strftime("%Y-%m-%d")}\n'
        error_write += f'Hour: {datetime.datetime.now().strftime("%H:%M")}\n'
    error_write += "\n"
    name_file_log = "/log_py_" + datetime.datetime.now().strftime("%Y-%m-%d") + ".txt"
    log_error = open(root_path + name_file_log, "a")
    log_error.write(error_write)
    log_error.close()

def descarga(): 
    """Funcion que descarga el video"""
    try:
        itag_id = sys.argv[2]
        if (video is None):
            errors.append({'rule': 'url', 'message': 'No se ha enviado la url', 'field': 'url'})
        else:     
            prepare_to_down = video.streams.get_by_itag(itag_id)
            if not prepare_to_down is None:
                #save image in image folder:
                descargarImagen(video.thumbnail_url)
                last_k = prepare_to_down.abr.rfind('k') + 1
                global kbps_file
                kbps_file = prepare_to_down.abr[:last_k]
                path_to_down = audio_path + clearTitle(video.title, video.author).strip() + '.' + prepare_to_down.mime_type.split('/')[1]
                prepare_to_down.download(filename=path_to_down)
            else :
                errors.append({'rule': 'itag', 'message': 'No se encontró el itag', 'field': 'itag'})
    except IndexError as e:
        errors_causes.append({'parent':"IndexError", 'value': e.__str__()})
        errors.append({'rule': 'itag', 'message': 'No se encontró el itag', 'field': 'itag'})
    except pytube.exceptions.RegexMatchError as e:
        errors_causes.append({'parent':"RegexMatch", 'value': e.__str__()})
        errors.append({'rule': 'valid_url', 'message': 'No es una url válida', 'field': 'url'})
    except pytube.exceptions.VideoUnavailable as e:
        errors_causes.append({'parent':"VideoUnavailable", 'value': e.__str__()})
        errors.append({'rule': 'yt_url', 'message': "No se encontró el video o no es una url descargable", 'field': 'url'})
    except BaseException as e:
        errors_causes.append({'parent':"BaseException", 'value': e.__str__()})
        errors.append({'message': "Ocurrió un error que no se esperaba", 'field': 'script_error', 'rule': 'run_enabled_script'})
try:
    get_path_ffmpeg_or_download()
    init()
    descarga()
finally:
    if len(errors) > 0:
        print(errors)
        log_error()
        subprocess.run(['rm', rutaSalida], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        subprocess.run(['rm', images_path + nombreImagenTmp +  '.jpg'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)