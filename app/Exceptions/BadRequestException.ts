import { Exception } from '@adonisjs/core/build/standalone'
import HttpConstants from 'App/Constants/HttpConstants'
import ErrorResponse from 'App/Models/ErrorResponse'

/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@adonisjs/core` allows defining
| a status code and error code for every exception.
|
| @example
| new BadRequestException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class BadRequestException extends Exception {

    errorResponse: ErrorResponse

    constructor(errorResponse: ErrorResponse) {
        super(errorResponse.title, HttpConstants.BAD_REQUEST_CODE, errorResponse.type)
        this.errorResponse = errorResponse
    }

}
