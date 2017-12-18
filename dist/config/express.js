"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var bodyParser = require("body-parser");
var morgan = require("morgan");
var helmet = require("helmet");
var methodOverride = require("method-override");
var knex = require("knex");
var settings_1 = require("./settings");
var constants_1 = require("./constants");
var all_js_1 = require("../app/routes/all.js");
var utils = require(settings_1.default().support + '/utils/log-utils')(settings_1.default());
var security = require(settings_1.default().support + '/utils/security')(settings_1.default());
function default_1() {
    var app = express();
    morgan.format('custom', '[:date[web]] :method :url - :status - :response-time ms - :user-agent');
    app.enable('trust proxy');
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(morgan('custom'));
    app.use(methodOverride());
    app.use(helmet());
    app.disable('X-powered-by');
    app.use(security.ensureEnabledConsumers);
    Object.assign(app, {
        main: knex({
            client: 'sqlite3',
            connection: {
                filename: '../shared/db/database.db'
            }
        })
    });
    app.use('/', all_js_1.default(app, constants_1.default.v1));
    return app;
}
exports.default = default_1;
//# sourceMappingURL=express.js.map