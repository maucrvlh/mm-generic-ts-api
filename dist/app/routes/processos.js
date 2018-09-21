"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var processosController = require("../controllers/processos");
var all_1 = require("../controllers/all");
var v1;
(function (v1) {
    var router = express.Router();
    router.get('/', processosController.v1.list);
    router.get('/details/:processo', processosController.v1.details);
    router.get('/saj/:processo', processosController.v1.getFromSaj);
    router.get('/blob', processosController.v1.getBlob);
    router.get('/projudi/:processo', processosController.v1.getFromProjudi);
    router.post('/', all_1.verify, processosController.v1.save);
    router.delete('/:processo', all_1.verify, processosController.v1.del);
    router.put('/:processo', all_1.verify, processosController.v1.update);
    function routes() {
        return router;
    }
    v1.routes = routes;
})(v1 = exports.v1 || (exports.v1 = {}));
var v2;
(function (v2) {
    var router = express.Router();
    router.get('/', processosController.v2.list);
    function routes() {
        return router;
    }
    v2.routes = routes;
})(v2 = exports.v2 || (exports.v2 = {}));
//# sourceMappingURL=processos.js.map