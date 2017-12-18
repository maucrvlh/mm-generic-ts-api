"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("http");
var express_1 = require("./config/express");
var PORT = 3001;
http.createServer(express_1.default()).listen(PORT, function () {
    console.log("Server running at port " + PORT + ".");
});
//# sourceMappingURL=index.js.map