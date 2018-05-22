import settings from '../../config/settings';
import constants from '../../config/constants';
import queries from './queries';
import * as db2 from 'tjam-node-db2-helper';
import * as pg from 'tjam-node-pg-helper';

// Aqui ficam os métodos que chamam
// os módulos de acesso aos bancos de
// dados.
// Para mais informações sobre uso e sintaxe
// dos módulos db2 e pg, bem como os detalhes
// da instalação do módulo db2, que requer algumas
// observações, veja em:
//
//      DB2         -> http://git.tjam.jus.br/local-node-modules/tjam-node-db2-helper
//      Postgres    -> http://git.tjam.jus.br/local-node-modules/tjam-node-pg-helper

export namespace v1 {
    export function processFromSaj(body?: string | object) {
        return new Promise((resolve, reject) => {
            let data = {
                schema: settings().system.db.saj.conn.pg,
                statement: queries.saj.pg.select.queryDadosDoProcesso,
                params: body
            }

            db2.connect(data)
                .then((c) => { return db2.single(c); })
                .then((done) => { resolve(done); })
                .catch((err) => { reject(err); });
        });
    }

    export function processFromProjudi(body?: string | object) {
        return new Promise((resolve, reject) => {
            let data = {
                schema: settings().system.db.projudi.conn.cnjBrasil,
                statement: queries.projudi.cnjbrasil.select.queryDadosProcesso,
                params: body
            }

            pg.connect(data)
                .then((c) => { return pg.single(c); })
                .then((done) => { resolve(done); })
                .catch((err) => { reject(err); });
        });
    }
}