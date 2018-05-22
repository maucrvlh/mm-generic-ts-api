"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var knex = require("knex");
var sqlite;
function initSqliteDatabase() {
    sqlite = knex({
        client: 'sqlite3',
        connection: {
            filename: '../shared/db/processos.db'
        }
    });
}
exports.initSqliteDatabase = initSqliteDatabase;
function default_1() {
    return sqlite;
}
exports.default = default_1;
//# sourceMappingURL=bootstrap.js.map