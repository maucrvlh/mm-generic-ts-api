"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var settings_1 = require("../../config/settings");
var constants_1 = require("../../config/constants");
var utils = require(settings_1.default().support + '/utils/log-utils')(settings_1.default());
var InvalidRequestException = require(settings_1.default().support + '/exceptions/InvalidRequestException');
var GenericErrorException = require(settings_1.default().support + '/exceptions/GenericErrorException');
var InvalidFormatException = require(settings_1.default().support + '/exceptions/InvalidFormatException');
var validators = require(settings_1.default().support + '/helpers/validators');
exports.default = function (app) {
    var controller = { v1: null };
    var proceed = function (v) {
        if (settings_1.default().system.debug)
            utils.info("Procedendo para a listagem.");
        return Promise.resolve(v);
    };
    var list = function (v) {
        return new Promise(function (resolve, reject) {
            app.db.main
                .from('generic')
                .select()
                .then(function (rows) {
                v.success = rows;
                resolve(v);
            })
                .catch(function (err) {
                v.error = err;
                v.error.message = err.message ? err.message : 'Não foi possível obter os dados.';
                reject(v);
            });
        });
    };
    var result = function (v) {
        if (v.success)
            v.res.status(200).json({ status: 'success', records: v.success });
    };
    var error = function (v) { return v.next(v.error); };
    controller.v1 = {
        list: function (req, res, next) {
            proceed({ req: req, res: res, next: next, context: constants_1.default.v1 })
                .then(list)
                .then(result)
                .catch(error)
                .catch(function (err) {
                next(new GenericErrorException('Erro interno: %s', err.toString()));
            });
        }
    };
    return controller;
};
//# sourceMappingURL=search.js.map