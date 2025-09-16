import ErrorDetailModel from "App/Models/ErrorDetailModel"

export default class ErrorMoreDetail {

    detail: string
    errors: ErrorDetailModel[]

    constructor(detail: string, errors: ErrorDetailModel[]) {
        this.detail = detail
        this.errors = errors
    }

}