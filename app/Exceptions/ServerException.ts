import { Exception } from "@adonisjs/core/build/standalone";

export default class ServerException extends Exception {
  public messageError: string;
  public ruleInfo: string[];
  public cause: string;

  constructor(
    message: string,
    code: number,
    messageError: string,
    ruleInfo: string[] = [],
    cause: string = ""
  ) {
    super(message, code);
    this.messageError = messageError;
    this.ruleInfo = ruleInfo;
    this.cause = cause;
  }
}
