"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var settings_1 = require("../../config/settings");
var queries_1 = require("./queries");
exports.default = {
    process: function (body) {
        return new Promise(function (resolve, reject) {
            var data = {
                schema: settings_1.default().system.db.saj.conn.pg,
                statement: queries_1.default.saj.pg.select.stations,
                params: body
            };
        });
    }
};
//# sourceMappingURL=processos.js.map