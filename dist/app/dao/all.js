"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var settings_1 = require("../../config/settings");
var queries_1 = require("./queries");
var db2 = require("tjam-node-db2-helper");
var pg = require("tjam-node-pg-helper");
var v1;
(function (v1) {
    function processFromSaj(body) {
        return new Promise(function (resolve, reject) {
            var data = {
                schema: settings_1.default().system.db.saj.conn.pg,
                statement: queries_1.default.saj.pg.select.queryDadosDoProcesso,
                params: body
            };
            db2.connect(data)
                .then(function (c) { return db2.single(c); })
                .then(function (done) { resolve(done); })
                .catch(function (err) { reject(err); });
        });
    }
    v1.processFromSaj = processFromSaj;
    function blobFromSaj(body) {
        return new Promise(function (resolve, reject) {
            var data = {
                schema: settings_1.default().system.db.saj.conn.pg,
                statement: queries_1.default.saj.pg.select.queryGetBlob,
                params: body
            };
            db2.connect(data)
                .then(function (c) { return db2.single(c); })
                .then(function (done) { resolve(done); })
                .catch(function (err) { reject(err); });
        });
    }
    v1.blobFromSaj = blobFromSaj;
    function processFromProjudi(body) {
        return new Promise(function (resolve, reject) {
            var data = {
                schema: settings_1.default().system.db.projudi.conn.cnjBrasil,
                statement: queries_1.default.projudi.cnjbrasil.select.queryDadosProcesso,
                params: body
            };
            pg.connect(data)
                .then(function (c) { return pg.single(c); })
                .then(function (done) { resolve(done); })
                .catch(function (err) { reject(err); });
        });
    }
    v1.processFromProjudi = processFromProjudi;
})(v1 = exports.v1 || (exports.v1 = {}));
//# sourceMappingURL=all.js.map