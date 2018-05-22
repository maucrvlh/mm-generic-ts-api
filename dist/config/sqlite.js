"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var knex = require("knex");
var sqlite;
function initSqliteDatabase() {
    return new Promise(function (resolve, reject) {
        sqlite = knex({
            client: 'sqlite3',
            connection: {
                filename: '../shared/db/processos.db'
            }
        });
        resolve();
    });
}
(function () { return initSqliteDatabase(); })();
function default_1() {
    return sqlite;
}
exports.default = default_1;
//# sourceMappingURL=sqlite.js.map