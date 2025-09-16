export default class ErrorDetailModel {

    code: string | undefined
    field: string | undefined
    message: string | undefined
    reason: string | undefined

    constructor(code: string | undefined, field: string | undefined, message: string | undefined, reason: string | undefined = "") {
        this.code = code
        this.field = field
        this.message = message
        this.reason = reason

    }
}