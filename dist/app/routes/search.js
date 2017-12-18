"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var constants_1 = require("../../config/constants");
var search_1 = require("../controllers/search");
exports.default = function (app, context) {
    var router = express.Router();
    var controller = app.controllers;
    if (context == constants_1.default.v1) {
        router.get('/', search_1.default(app).v1.list);
    }
    return router;
};
//# sourceMappingURL=search.js.map