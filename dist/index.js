"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("http");
var utils = require("tjam-node-log-utils");
var settings_1 = require("./config/settings");
var express_1 = require("./config/express");
var PORT = 3001;
http.createServer(express_1.default()).listen(PORT, function () {
    utils.info(settings_1.default().system.name + " rodando na porta " + PORT + ".");
});
//# sourceMappingURL=index.js.map