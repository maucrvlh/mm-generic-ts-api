import C from './constants';

interface BasicSettings {
	system: {
		name: string;
		APIid: string;
		v: string;
		basePath: string;
		docPath: string;
		enableProxy: boolean;
		loginRequired: boolean;
		debug: boolean;
		db?: {
			host?: string;
			name?: string;
			conn?: string;
		};
		sessionName: string;
	};
	auth?: AuthSettings;
	permissions: {
		access: {
			groups: Array<string>;
			users: Array<string>;
		},
		consumer: {
			hostnames: Array<string>;
		}
	};
	jwt: Object;
	support?: string;
}

interface AuthSettings {
	db2?: {
        production: {
            localhost: {
                net: string;
                pg: string;
                sg: string;
            }
        },
        development: {
            localhost: {
                net: string;
                pg: string;
                sg: string;                
			}
        }
    }
	perms?: {
        production: {
            base: string;
        }
        development: {
            base: string;
        }
    }
	base?: string;
	routes?: {
		login: string;
		verify: string;
		logout: string;
	}
}

export default function settings() {
	let r: BasicSettings = { 
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
			expirationTime: 60*60*2 // segundos
		}
	};
	
	if (process.env.NODE_ENV == 'production') {
		r.support = '/home/support';
		r.auth = require('/home/support/config/envs').auth.production;
		r.permissions = {
			...r.permissions,
			consumer: {
				hostnames: []
			}
		}
		r.system = {
			...r.system,
			db: {
				host: 'localhost',
				name: 'generic',
				conn: require('/home/support/config/envs').db2.production.localhost
			}
		}
	} else {
		r.support = '/home/mauricio/dev/env/projects/support';
		r.auth = require('/home/mauricio/dev/env/projects/support/config/envs').auth.development;
		r.permissions = {
			...r.permissions,
			consumer: {
				hostnames: []
			}
		}
		r.system = {
			...r.system,
			db: {
				host: 'localhost',
				name: 'generic',
				conn: require('/home/mauricio/dev/env/projects/support/config/envs').db2.development.localhost
			}
		}
	}
	return r;
}