// import * as unirest from 'unirest';
import settings from '../../config/settings';
import Constants from '../../config/constants';
import { Response, Request, NextFunction } from 'express';

const unirest = require('unirest');

const InvalidHttpMethodException = require(settings().support+'/exceptions/InvalidHttpMethodException');
const InvalidHttpHeaderException = require(settings().support+'/exceptions/InvalidHttpHeaderException');
const InvalidRequestException = require(settings().support+'/exceptions/InvalidRequestException');
const PageNotFoundException = require(settings().support+'/exceptions/PageNotFoundException');
const MissingTokenException = require(settings().support+'/exceptions/MissingTokenException');
const MissingHttpHeaderException = require(settings().support+'/exceptions/MissingHttpHeaderException');
const ConnectionErrorException = require(settings().support+'/exceptions/ConnectionErrorException');
const GenericErrorException = require(settings().support+'/exceptions/GenericErrorException');
const AllowedGroupNotFoundException = require(settings().support+'/exceptions/AllowedGroupNotFoundException');
const AllowedUserNotFoundException = require(settings().support+'/exceptions/AllowedUserNotFoundException');

const encoders = require(settings().support+'/helpers/encoders');


var extract = (headers: any): { success: boolean, token?: string, err?: string | number } => {
	if (headers && headers.authorization) {
		let parted = headers.authorization.split(' ');
		if (parted.length === 2) {
			return {success: true, token: parted[1] };
		} else {
			return {success: false, err: Constants.INVALID_HTTP_HEADER};
		}
	} else {
		return {success: false, err: Constants.MISSING_HTTP_HEADER};
	}
}

export function welcome(req: Request, res: Response, next: NextFunction) {
	let doc = `${settings().system.basePath}/${settings().system.v}${settings().system.docPath}`;
	res.status(200).json({ status: 'success', api: settings().system.APIid, description: `Bem vindo. Consulte a documentação em '${doc}'.` });
}

export function documentation(req: Request, res: Response, next: NextFunction) {
	res.status(200).json({ status: 'success', description: `Bem vindo à documentação da API ${settings().system.v}`});
}

export function login(req: Request, res: Response, next: NextFunction) {
	if (!req.query.mode || req.query.mode != 'guest') {
		if (req.method.toLowerCase() !== 'post') 
			return next(new InvalidHttpMethodException('O método HTTP utilizado para o login deve ser POST.'));
		
		if ((!req.body.username || !req.body.password) && !req.body.credentials)
			return next(new InvalidRequestException('Informe seu login e senha de rede.'));
	}
	
	
	let uri = settings().auth.base + settings().auth.routes.login;
	
	let mode = req.query.mode == 'guest' ? 4 : req.body.mode || 1;

	let username = req.query.mode == 'guest' ? settings().system.APIid.concat('guest-user') : req.body.username ? req.body.username : Buffer.from(Buffer.from(req.body.credentials, 'base64').toString().split('/')[0], 'base64').toString();
	let password = req.query.mode == 'guest' ? settings().system.APIid.concat('guest-pass-').concat(Math.round((Math.random()+1)*100e8).toString()) : req.body.password ? req.body.password : Buffer.from(Buffer.from(req.body.credentials, 'base64').toString().split('/')[1], 'base64').toString();

	unirest
		.post(uri)
		.headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
		.send({ 'username': username, 'password': password, mode: mode })
		.end(function(response: any) {
			if (response.error)
				return res.status(response.statusCode || 500).json(response.body);
			
			if (!response.body)
				return next(new InvalidRequestException(response, 500));
			
			if (settings().permissions) {
				if (settings().permissions.access) {
					if (settings().permissions.access.groups && settings().permissions.access.groups.length > 0) {
						let memberOf = response.body.user.ldapData[0].memberOf;
						memberOf = Array.isArray(memberOf) ? memberOf : [memberOf];						
						memberOf = memberOf.map((el: string, i: any, a: any) => el.split(',')[0].split('=')[1]);						
						if (!(memberOf.some((el: any, i: any, a: any) => !!~settings().permissions.access.groups.indexOf(el))))
							return next(new AllowedGroupNotFoundException(response, 500));
					}
					if (settings().permissions.access.users && settings().permissions.access.users.length > 0) {
						if (!~settings().permissions.access.users.indexOf(response.body.user.username))
							return next(new AllowedUserNotFoundException());
					}
				}
			}

			let encoded = encoders.b64o(Buffer.from(JSON.stringify({ _: encoders.b64o(response.body.token) }), 'ascii').toString('base64'));
			let json = req.query.mode == 'guest' ? { status:'success', '_': encoded } : { status:'success', username: response.body.user.username, displayName: (response.body.user.ldapData[0].givenName || response.body.user.ldapData[0].displayName || response.body.user.username), '_': encoded };
			
			res.status(response.statusCode || 200).json(json);
		});
}

export function verify(req: any, res: any, next: any) {	
	let uri = settings().auth.base + settings().auth.routes.verify;
	let token = '';
	
	let extracted = extract(req.headers);
	if (!extracted.success) {
		switch(extracted.err) {
			case Constants.INVALID_HTTP_HEADER:
				next(new InvalidHttpHeaderException());
				break;
			case Constants.MISSING_HTTP_HEADER:
				next(new MissingHttpHeaderException);
				break;
			default:
				next(new MissingTokenException('Esta requisição necessita de um token de autenticação.', 401));
		}
		return;
	} else {
		token = extracted.token;	
	}
	
	unirest
		.get(uri)
		.headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer '+token})
		.end(function(response: any) {
			if (response.error && response.body) {
				delete(response.body.success);
				response.body.status = 'error';						
				return res.status(response.statusCode || 500).json(response.body);					
			}
			 
			if (!response.body)
				return next(new InvalidRequestException(response, 500));
			
			
			if (response.body.success && response.body.isLoggedIn) {
				req.userLoggedIn = response.body.details.username;
				next();
			} else {
				delete(response.body.success);
				response.body.status = 'error';
				return res.status(response.statusCode || 500).json(response.body);
			}
		});
}


export function logout(req: any, res: any, next: any) {
	let uri = settings().auth.base + settings().auth.routes.logout;
	let token = '';
	
	let extracted = extract(req.headers);
	if (!extracted.success) {
		switch(extracted.err) {
			case Constants.INVALID_HTTP_HEADER:
				next(new InvalidHttpHeaderException());
				break;
			case Constants.MISSING_HTTP_HEADER:
				next(new MissingHttpHeaderException);
				break;
			default:
				next(new MissingTokenException('Esta requisição necessita de um token de autenticação.', 401));
		}
		return;
	} else {
		token = extracted.token;	
	}
	
	unirest
		.get(uri)
		.headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer '+token})
		.end(function(response: any) {
			if (response.error)
				return res.status(response.statusCode).json(response.body);
				
			if (!response.body)
				return next(new InvalidRequestException(response, 500));
			 
			if (response.body.success && !response.body.isLoggedIn) {
				delete req.userLoggedIn;
				res.status(200).json({status: 'success'});
			} else {
				res.status(response.statusCode || 500).json(response.body);
				return;
			}
		});
}

export function session(req: any, res: any, next: any) {
	res.status(200).json({status: 'success'});
}

export const invalidEndpoint = {
	detailed: (error: any, req: Request, res: Response, next: NextFunction) => {
		res.status(error.code || 500).json({status: 'error', message: error.message, details: { exception: error.type, code: error.code, stack: error.stack, more: error.more?error.more:'--' } } );	
	},
	concise: (error: any, req: Request, res: Response, next: NextFunction) => {
		res.status(error.code || 500).json({status: 'error', message: error.message, details: { exception: error.type, code: error.code, more: error.more?error.more:'--' } } );	
	}
}
