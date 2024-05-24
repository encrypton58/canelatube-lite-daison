/**
 * Modelo envia cuando se genera un error en algun parametro
 * @param {String} rule Regla que debe tener el parametro
 * @param {String} field Parametro que genera el error
 * @returns { rule,field}
 */
export default class ErrorModel {
    public rule: string;
    public field: string;

    constructor(rule: string, field: string) {
        this.rule = rule;
        this.field = field;
    }
}
