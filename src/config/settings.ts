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
		db?: { [key: string]: { host?: string; name?: string; conn?: { [key: string]: string } } };
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


// Configurações gerais da API
// Aqui são definidos o nome da API, a APIid (aquela que aparece no log)
// e serve para encontrar a API nas requisições, a identificação da sessão
// no servidor Redis e as configurações de banco de dados.
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
		r.support = '/opt/node/services/support/';
		r.auth = require('/opt/node/services/support/config/envs').auth.production;
		r.permissions = {
			...r.permissions,
			consumer: {
				hostnames: []
			}
		}
		r.system = {
			...r.system,
			db: {
				saj: {
					conn: require('/opt/node/services/support/config/envs').db2.production.localhost
				},
				projudi: {					
					conn: require('/opt/node/services/support/config/envs').pg.production.projudi
				}
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
				saj: {
					conn: require('/home/mauricio/dev/env/projects/support/config/envs').db2.development.localhost
				},
				projudi: {					
					conn: require('/home/mauricio/dev/env/projects/support/config/envs').pg.development.projudi
				}
			}
		}
	}
	return r;
}