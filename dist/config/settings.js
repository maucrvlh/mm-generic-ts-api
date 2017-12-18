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
            APIid: 'tjam-generic-es7-api',
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
        r.support = '/home/support';
        r.auth = require('/home/support/config/envs').auth.production;
        r.permissions = __assign({}, r.permissions, { consumer: {
                hostnames: []
            } });
        r.system = __assign({}, r.system, { db: {
                host: 'localhost',
                name: 'generic',
                conn: require('/home/support/config/envs').db2.production.localhost
            } });
    }
    else {
        r.support = '/home/mauricio/dev/env/projects/support';
        r.auth = require('/home/mauricio/dev/env/projects/support/config/envs').auth.development;
        r.permissions = __assign({}, r.permissions, { consumer: {
                hostnames: []
            } });
        r.system = __assign({}, r.system, { db: {
                host: 'localhost',
                name: 'generic',
                conn: require('/home/mauricio/dev/env/projects/support/config/envs').db2.development.localhost
            } });
    }
    return r;
}
exports.default = settings;
//# sourceMappingURL=settings.js.map