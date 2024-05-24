import { Exception } from "@adonisjs/core/build/standalone";

export default class ServerException extends Exception {

    public messageError: string
    public ruleInfo: string[]

    constructor(message: string, code: number, messageError: string, ruleInfo: string[] = []) {
        super(message, code);
        this.messageError = messageError
        this.ruleInfo = ruleInfo
    }
}
