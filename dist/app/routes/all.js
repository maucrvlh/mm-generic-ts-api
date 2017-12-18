"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var constants_1 = require("../../config/constants");
var settings_1 = require("../../config/settings");
var commons_1 = require("../controllers/commons");
var search_1 = require("./search");
var PageNotFoundException = require(settings_1.default().support + '/exceptions/PageNotFoundException');
exports.default = function (app, context) {
    var router = express.Router();
    if (context == constants_1.default.v1) {
        var v1 = settings_1.default().system.basePath + "/" + constants_1.default.v1;
        router.all('/', commons_1.welcome);
        router.all(v1 + "/", commons_1.welcome);
        router.all("" + v1 + settings_1.default().system.docPath, commons_1.welcome);
        router.all(v1 + "/login", commons_1.login);
        router.all(v1 + "/verify", commons_1.verify);
        router.all(v1 + "/logout", commons_1.logout);
        router.all(v1 + "/session", commons_1.verify, commons_1.session);
        router.use(v1 + "/search", commons_1.verify, search_1.default(app, context));
        router.use(function (req, res, next) {
            var err = new PageNotFoundException('O REST end point não pôde ser encontrado. Consulte a documentação em /docs.', 404);
            next(err);
        });
        if (app.get('env') === 'development') {
            router.use(commons_1.invalidEndpoint.detailed);
        }
        router.use(commons_1.invalidEndpoint.concise);
    }
    return router;
};
//# sourceMappingURL=all.js.map