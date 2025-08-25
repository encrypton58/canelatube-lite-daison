export default class ErrorResponse {

    type: string
    title: string
    status: number
    detail: string
    more: any

    constructor(type: string, title: string, status: number, detail: string) {
        this.type = type
        this.title = title
        this.status = status
        this.detail = detail
    }

    setMore(more: any) {
        this.more = more
    }

}