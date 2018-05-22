"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var bodyParser = require("body-parser");
var helmet = require("helmet");
var methodOverride = require("method-override");
var utils = require("tjam-node-log-utils");
var settings_1 = require("./settings");
var all = require("../app/routes/all.js");
var all_1 = require("../app/controllers/all");
var tjam_node_exceptions_1 = require("tjam-node-exceptions");
function default_1() {
    var app = express();
    utils.setSettings(settings_1.default());
    app.enable('trust proxy');
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(methodOverride());
    app.use(helmet());
    app.disable('X-powered-by');
    app.use(utils.plugin);
    app.use(function (req, res, next) {
        if (settings_1.default().permissions) {
            if (settings_1.default().permissions.consumer) {
                if (settings_1.default().permissions.consumer.hostnames && settings_1.default().permissions.consumer.hostnames.length > 0) {
                    if (!req.get('referrer') || !(settings_1.default().permissions.consumer.hostnames.some(function (el, i, a) { return !!~req.get('referrer').indexOf(el); })))
                        return next(new tjam_node_exceptions_1.ConsumerNotAllowedException());
                }
            }
        }
        next();
    });
    app.use('/', all.v1.routes());
    app.use('/', all.v2.routes());
    app.use(function (req, res, next) {
        var err = new tjam_node_exceptions_1.PageNotFoundException('O REST end point não pôde ser encontrado. Consulte a documentação em /docs.', 404);
        next(err);
    });
    if (process.env.NODE_ENV === 'development') {
        app.use(all_1.invalidEndpoint.detailed);
    }
    app.use(all_1.invalidEndpoint.concise);
    return app;
}
exports.default = default_1;
//# sourceMappingURL=express.js.map