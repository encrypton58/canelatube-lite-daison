
/**
 * Class DetailSong
 * @class
 * @classdesc Clase que contiene la información de una canción.
 * @property {string} title - Título de la canción.
 * @property {Array<{ itag: number, type: string, size: string, quality: string }>} formats - Formatos disponibles para descargar la canción.
 * @property {string} thumbnail - Imagen de la canción.
 * @property {number | undefined} isSoLong - Indica si la canción es muy larga.
 */
export default class DetailSong {

    public title: string
    public formats: { itag: number, type: string, size: string, quality: string }[]
    public thumbnail: string
    public isSoLong: number | undefined = undefined

    constructor(title: string, formats: { itag: number, type: string, size: string, quality: string }[], thumbnail: string, isSoLong?: number) {
        this.title = title
        this.formats = formats
        this.thumbnail = thumbnail
        if (isSoLong) {
            this.isSoLong = isSoLong
        }
    }

}
