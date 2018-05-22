import * as knex from 'knex';

let sqlite: knex;

function initSqliteDatabase(): Promise<any> {
    return new Promise((resolve, reject) => {
        sqlite = knex({
            client: 'sqlite3',
            connection: {
                filename: '../shared/db/processos.db'
            }
        });
        resolve();
    });
}


// Autoinicialização
(() => initSqliteDatabase())();

export default function (): knex {
    return sqlite;
}