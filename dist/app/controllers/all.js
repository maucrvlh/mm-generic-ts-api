"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var settings_1 = require("../../config/settings");
var constants_1 = require("../../config/constants");
var tjam_node_exceptions_1 = require("tjam-node-exceptions");
var tjam_node_toolbox_1 = require("tjam-node-toolbox");
var unirest = require('unirest');
function extract(headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return { success: true, token: parted[1] };
        }
        else {
            return { success: false, err: constants_1.default.INVALID_HTTP_HEADER };
        }
    }
    else {
        return { success: false, err: constants_1.default.MISSING_HTTP_HEADER };
    }
}
function welcome(req, res, next) {
    var doc = settings_1.default().system.basePath + "/" + settings_1.default().system.v + settings_1.default().system.docPath;
    res.status(200).json({ status: 'success', api: settings_1.default().system.APIid, description: "Bem vindo. Consulte a documenta\u00E7\u00E3o em '" + doc + "'." });
}
exports.welcome = welcome;
function documentation(req, res, next) {
    res.status(200).json({ status: 'success', description: "Bem vindo \u00E0 documenta\u00E7\u00E3o da API " + settings_1.default().system.v });
}
exports.documentation = documentation;
function login(req, res, next) {
    if (!req.query.mode || req.query.mode != 'guest') {
        if (req.method.toLowerCase() !== 'post')
            return next(new tjam_node_exceptions_1.InvalidHttpMethodException('O método HTTP utilizado para o login deve ser POST.'));
        if ((!req.body.username || !req.body.password) && !req.body.credentials)
            return next(new tjam_node_exceptions_1.InvalidRequestException('Informe seu login e senha de rede.'));
    }
    var uri = settings_1.default().auth.base + settings_1.default().auth.routes.login;
    var mode = req.query.mode == 'guest' ? 4 : req.body.mode || 1;
    var username = req.query.mode == 'guest' ? settings_1.default().system.APIid.concat('guest-user') : req.body.username ? req.body.username : Buffer.from(Buffer.from(req.body.credentials, 'base64').toString().split('/')[0], 'base64').toString();
    var password = req.query.mode == 'guest' ? settings_1.default().system.APIid.concat('guest-pass-').concat(Math.round((Math.random() + 1) * 100e8).toString()) : req.body.password ? req.body.password : Buffer.from(Buffer.from(req.body.credentials, 'base64').toString().split('/')[1], 'base64').toString();
    unirest
        .post(uri)
        .headers({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        .send({ 'username': username, 'password': password, mode: mode })
        .end(function (response) {
        if (response.error)
            return res.status(response.statusCode || 500).json(response.body);
        if (!response.body)
            return next(new tjam_node_exceptions_1.InvalidRequestException(response, 500));
        if (settings_1.default().permissions) {
            if (settings_1.default().permissions.access) {
                if (settings_1.default().permissions.access.groups && settings_1.default().permissions.access.groups.length > 0) {
                    var memberOf = response.body.user.ldapData[0].memberOf;
                    memberOf = Array.isArray(memberOf) ? memberOf : [memberOf];
                    memberOf = memberOf.map(function (el, i, a) { return el.split(',')[0].split('=')[1]; });
                    if (!(memberOf.some(function (el, i, a) { return !!~settings_1.default().permissions.access.groups.indexOf(el); })))
                        return next(new tjam_node_exceptions_1.LDAPAllowedGroupException(response, 500));
                }
                if (settings_1.default().permissions.access.users && settings_1.default().permissions.access.users.length > 0) {
                    if (!~settings_1.default().permissions.access.users.indexOf(response.body.user.username))
                        return next(new tjam_node_exceptions_1.LDAPDeniedAccessException());
                }
            }
        }
        var encoded = tjam_node_toolbox_1.Base64.obfuscate(Buffer.from(JSON.stringify({ _: tjam_node_toolbox_1.Base64.obfuscate(response.body.token) }), 'ascii').toString('base64'));
        var json = req.query.mode == 'guest' ? { status: 'success', '_': encoded } : { status: 'success', username: response.body.user.username, displayName: (response.body.user.ldapData[0].givenName || response.body.user.ldapData[0].displayName || response.body.user.username), '_': encoded };
        res.status(response.statusCode || 200).json(json);
    });
}
exports.login = login;
function verify(req, res, next) {
    var uri = settings_1.default().auth.base + settings_1.default().auth.routes.verify;
    var token = '';
    var extracted = extract(req.headers);
    if (!extracted.success) {
        switch (extracted.err) {
            case constants_1.default.INVALID_HTTP_HEADER:
                next(new tjam_node_exceptions_1.InvalidHttpHeaderException());
                break;
            case constants_1.default.MISSING_HTTP_HEADER:
                next(new tjam_node_exceptions_1.MissingHttpHeaderException);
                break;
            default:
                next(new tjam_node_exceptions_1.MissingTokenException('Esta requisição necessita de um token de autenticação.', 401));
        }
        return;
    }
    else {
        token = extracted.token;
    }
    unirest
        .get(uri)
        .headers({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token })
        .end(function (response) {
        if (response.error && response.body) {
            delete (response.body.success);
            response.body.status = 'error';
            return res.status(response.statusCode || 500).json(response.body);
        }
        if (!response.body)
            return next(new tjam_node_exceptions_1.InvalidRequestException(response, 500));
        if (response.body.success && response.body.isLoggedIn) {
            req.userLoggedIn = response.body.details.username;
            next();
        }
        else {
            delete (response.body.success);
            response.body.status = 'error';
            return res.status(response.statusCode || 500).json(response.body);
        }
    });
}
exports.verify = verify;
function logout(req, res, next) {
    var uri = settings_1.default().auth.base + settings_1.default().auth.routes.logout;
    var token = '';
    var extracted = extract(req.headers);
    if (!extracted.success) {
        switch (extracted.err) {
            case constants_1.default.INVALID_HTTP_HEADER:
                next(new tjam_node_exceptions_1.InvalidHttpHeaderException());
                break;
            case constants_1.default.MISSING_HTTP_HEADER:
                next(new tjam_node_exceptions_1.MissingHttpHeaderException());
                break;
            default:
                next(new tjam_node_exceptions_1.MissingTokenException('Esta requisição necessita de um token de autenticação.', 401));
        }
        return;
    }
    else {
        token = extracted.token;
    }
    unirest
        .get(uri)
        .headers({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token })
        .end(function (response) {
        if (response.error)
            return res.status(response.statusCode).json(response.body);
        if (!response.body)
            return next(new tjam_node_exceptions_1.InvalidRequestException(response, 500));
        if (response.body.success && !response.body.isLoggedIn) {
            delete req.userLoggedIn;
            res.status(200).json({ status: 'success' });
        }
        else {
            res.status(response.statusCode || 500).json(response.body);
            return;
        }
    });
}
exports.logout = logout;
exports.invalidEndpoint = {
    detailed: function (error, req, res, next) {
        res.status(error.code || 500).json({
            status: 'error',
            message: error.msg ? error.msg : error.message,
            details: {
                exception: error.details.exception ? error.details.exception : error.type,
                code: error.details.code ? error.details.code : error.code,
                stack: error.details.stack ? error.details.stack : error.stack,
                more: error.details.more ? error.details.more : '--'
            }
        });
    },
    concise: function (error, req, res, next) {
        res.status(error.code || 500).json({
            status: 'error',
            message: error.msg ? error.msg : error.message,
            details: {
                exception: error.details.exception ? error.details.exception : error.type,
                code: error.details.code ? error.details.code : error.code
            }
        });
    }
};
//# sourceMappingURL=all.js.map