"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MessagesTranslates_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Language/MessagesTranslates"));
class Language {
    async handle({ request }, next) {
        MessagesTranslates_1.default.language = request.headers().language?.toString() || 'en';
        await next();
    }
}
exports.default = Language;
//# sourceMappingURL=Language.js.map