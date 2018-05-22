"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
function settings() {
    var r = {
        system: {
            name: 'TJAM API genérica',
            APIid: 'tjam-generic-ts-api',
            v: 'v1',
            basePath: '/api',
            docPath: '/doc',
            enableProxy: false,
            loginRequired: true,
            debug: true,
            db: {},
            sessionName: 'generic-api-session'
        },
        auth: {},
        permissions: {
            access: {
                groups: [],
                users: []
            },
            consumer: {
                hostnames: []
            }
        },
        jwt: {
            secret: 'genericsecret',
            expirationTime: 60 * 60 * 2
        }
    };
    if (process.env.NODE_ENV == 'production') {
        r.support = '/opt/node/services/support/';
        r.auth = require('/opt/node/services/support/config/envs').auth.production;
        r.permissions = __assign({}, r.permissions, { consumer: {
                hostnames: []
            } });
        r.system = __assign({}, r.system, { db: {
                saj: {
                    conn: require('/opt/node/services/support/config/envs').db2.production.localhost
                },
                projudi: {
                    conn: require('/opt/node/services/support/config/envs').pg.production.projudi
                }
            } });
    }
    else {
        r.support = '/home/mauricio/dev/env/projects/support';
        r.auth = require('/home/mauricio/dev/env/projects/support/config/envs').auth.development;
        r.permissions = __assign({}, r.permissions, { consumer: {
                hostnames: []
            } });
        r.system = __assign({}, r.system, { db: {
                saj: {
                    conn: require('/home/mauricio/dev/env/projects/support/config/envs').db2.development.localhost
                },
                projudi: {
                    conn: require('/home/mauricio/dev/env/projects/support/config/envs').pg.development.projudi
                }
            } });
    }
    return r;
}
exports.default = settings;
//# sourceMappingURL=settings.js.map