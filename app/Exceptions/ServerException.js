"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const standalone_1 = require("@adonisjs/core/build/standalone");
class ServerException extends standalone_1.Exception {
    constructor(message, code, messageError, ruleInfo = [], cause = "") {
        super(message, code);
        this.messageError = messageError;
        this.ruleInfo = ruleInfo;
        this.cause = cause;
    }
}
exports.default = ServerException;
//# sourceMappingURL=ServerException.js.map