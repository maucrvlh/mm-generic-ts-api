"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var settings_1 = require("../../config/settings");
var utils = require("tjam-node-log-utils");
var tjam_node_exceptions_1 = require("tjam-node-exceptions");
var sqlite_1 = require("../dao/sqlite");
var dao = require("../dao/all");
var v1;
(function (v1) {
    function proceed(msg, v) {
        return new Promise(function (resolve, reject) {
            if (settings_1.default().system.debug)
                utils.info(msg);
            resolve(v);
        });
    }
    function getAllProcessFromLocalDatabase(v) {
        return new Promise(function (resolve, reject) {
            sqlite_1.default()
                .from('processos')
                .select()
                .then(function (rows) {
                v.temp = rows;
                resolve(v);
            })
                .catch(function (err) {
                v.error = new tjam_node_exceptions_1.GenericErrorException("N\u00E3o foi poss\u00EDvel obter os dados do banco de processos. Mensagem retornada pelo driver: " + err.toString());
                reject(v);
            });
        });
    }
    v1.getAllProcessFromLocalDatabase = getAllProcessFromLocalDatabase;
    function getProcessDetails(v) {
        var numeroProcesso = v.req.params.processo;
        return new Promise(function (resolve, reject) {
            sqlite_1.default()
                .from('processos')
                .select()
                .where({ numero: numeroProcesso })
                .then(function (rows) {
                v.success = rows;
                resolve(v);
            })
                .catch(function (err) {
                v.error = new tjam_node_exceptions_1.GenericErrorException("N\u00E3o foi poss\u00EDvel obter os dados do banco de processos. Mensagem retornada pelo driver: " + err.toString());
                reject(v);
            });
        });
    }
    function getProcessDetailsFromSaj(v) {
        return new Promise(function (resolve, reject) {
            var processo = v.req.params.processo;
            var filter = { processo: processo };
            dao.v1.processFromSaj(filter)
                .then(function (result) {
                v.success = result;
                resolve(v);
            })
                .catch(function (error) {
                v.error = new tjam_node_exceptions_1.GenericErrorException("Ocorreu um erro ao consultar o processo no SAJ: " + error.toString());
                reject(v);
            });
        });
    }
    function getProcessDetailsFromProjudi(v) {
        return new Promise(function (resolve, reject) {
            var processo = v.req.params.processo;
            var filter = { processo: processo };
            dao.v1.processFromProjudi(filter)
                .then(function (result) {
                v.success = result;
                resolve(v);
            })
                .catch(function (error) {
                v.error = new tjam_node_exceptions_1.GenericErrorException("Ocorreu um erro ao consultar o processo no Projudi: " + error.toString());
                reject(v);
            });
        });
    }
    function getListFromResult(v) {
        return new Promise(function (resolve, reject) {
            var list = v.temp.map(function (e) { return e.numero; });
            v.success = list;
            resolve(v);
        });
    }
    function result(v) {
        if (v.success)
            v.res.status(200).json({ status: 'success', records: v.success });
        else
            utils.error('O atributo success não foi configurado no objeto propagado!');
    }
    function error(v) {
        v.next(v.error);
    }
    function list(req, res, next) {
        proceed('procedendo p/ a listagem de processos no banco de dados local.', { req: req, res: res, next: next })
            .then(getAllProcessFromLocalDatabase)
            .then(getListFromResult)
            .then(result)
            .catch(error)
            .catch(function (err) {
            next(new tjam_node_exceptions_1.GenericErrorException('Erro interno: %s', err.toString()));
        });
    }
    v1.list = list;
    function details(req, res, next) {
        proceed('procedendo p/ os detalhes do processo.', { req: req, res: res, next: next })
            .then(getProcessDetails)
            .then(result)
            .catch(error)
            .catch(function (err) {
            next(new tjam_node_exceptions_1.GenericErrorException('Erro interno: %s', err.toString()));
        });
    }
    v1.details = details;
    function getFromSaj(req, res, next) {
        proceed('procedendo p/ obtenção do processo no SAJ.', { req: req, res: res, next: next })
            .then(getProcessDetailsFromSaj)
            .then(result)
            .catch(error)
            .catch(function (err) {
            next(new tjam_node_exceptions_1.GenericErrorException('Erro interno: %s', err.toString()));
        });
    }
    v1.getFromSaj = getFromSaj;
    function getFromProjudi(req, res, next) {
        proceed('procedendo p/ obtenção do processo do Projudi.', { req: req, res: res, next: next })
            .then(getProcessDetailsFromProjudi)
            .then(result)
            .catch(error)
            .catch(function (err) {
            next(new tjam_node_exceptions_1.GenericErrorException('Erro interno: %s', err.toString()));
        });
    }
    v1.getFromProjudi = getFromProjudi;
    function save(req, res, next) {
        proceed('procedendo p/ os detalhes do processo.', { req: req, res: res, next: next })
            .then(getAllProcessFromLocalDatabase)
            .then(result)
            .catch(error)
            .catch(function (err) {
            next(new tjam_node_exceptions_1.GenericErrorException('Erro interno: %s', err.toString()));
        });
    }
    v1.save = save;
    function del(req, res, next) {
        proceed('procedendo p/ os detalhes do processo.', { req: req, res: res, next: next })
            .then(getAllProcessFromLocalDatabase)
            .then(result)
            .catch(error)
            .catch(function (err) {
            next(new tjam_node_exceptions_1.GenericErrorException('Erro interno: %s', err.toString()));
        });
    }
    v1.del = del;
    function update(req, res, next) {
        proceed('procedendo p/ os detalhes do processo.', { req: req, res: res, next: next })
            .then(getAllProcessFromLocalDatabase)
            .then(result)
            .catch(error)
            .catch(function (err) {
            next(new tjam_node_exceptions_1.GenericErrorException('Erro interno: %s', err.toString()));
        });
    }
    v1.update = update;
})(v1 = exports.v1 || (exports.v1 = {}));
var v2;
(function (v2) {
    function proceed(msg, v) {
        return new Promise(function (resolve, reject) {
            if (settings_1.default().system.debug)
                utils.info(msg);
            resolve(v);
        });
    }
    function getListFromResult(v) {
        return new Promise(function (resolve, reject) {
            var list = v.temp.map(function (e) { return { numero: e.numero, foro: e.foro, vara: e.vara }; });
            v.success = list;
            resolve(v);
        });
    }
    function result(v) {
        if (v.success)
            v.res.status(200).json({ status: 'success', records: v.success });
        else
            utils.error('O atributo success não foi configurado no objeto propagado!');
    }
    function error(v) {
        v.next(v.error);
    }
    function list(req, res, next) {
        proceed('procedendo p/ a listagem de processos no banco de dados local.', { req: req, res: res, next: next })
            .then()
            .then(v1.getAllProcessFromLocalDatabase)
            .then(result)
            .catch(error)
            .catch(function (err) {
            next(new tjam_node_exceptions_1.GenericErrorException('Erro interno: %s', err.toString()));
        });
    }
    v2.list = list;
})(v2 = exports.v2 || (exports.v2 = {}));
//# sourceMappingURL=processos.js.map