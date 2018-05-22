"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var settings_1 = require("../../config/settings");
var all_1 = require("../controllers/all");
var processos = require("./processos");
var v1;
(function (v1) {
    var router = express.Router();
    router.all('/', all_1.welcome);
    router.all("/api/v1/", all_1.welcome);
    router.all("/api/v1" + settings_1.default().system.docPath, all_1.welcome);
    router.all("/api/v1/login", all_1.login);
    router.all("/api/v1/verify", all_1.verify);
    router.all("/api/v1/logout", all_1.logout);
    router.use("/api/v1/processos", processos.v1.routes());
    function routes() {
        return router;
    }
    v1.routes = routes;
})(v1 = exports.v1 || (exports.v1 = {}));
var v2;
(function (v2) {
    var router = express.Router();
    router.use("/api/v2/processos", processos.v2.routes());
    function routes() {
        return router;
    }
    v2.routes = routes;
})(v2 = exports.v2 || (exports.v2 = {}));
//# sourceMappingURL=all.js.map