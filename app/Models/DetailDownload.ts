
export default class DetailDownload {

    path: string;
    name: string;
    ext: string;
    size: string;
    image: string;
    url: string;

    constructor(path: string, name: string, ext: string, size: string, image: string, url: string) {
        this.path = path;
        this.name = name;
        this.ext = ext;
        this.size = size;
        this.image = image;
        this.url = url;
    }

}