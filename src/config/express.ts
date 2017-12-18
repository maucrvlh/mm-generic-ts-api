import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import * as helmet from 'helmet';
import * as methodOverride from 'method-override';
import * as knex from 'knex';
import settings from './settings';
import constants from './constants';
import routes from '../app/routes/all.js';

const utils = require(settings().support+'/utils/log-utils')(settings());
const security = require(settings().support+'/utils/security')(settings());


export default function() {
    let app = express();

    morgan.format('custom', '[:date[web]] :method :url - :status - :response-time ms - :user-agent');
    
    app.enable('trust proxy');
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    app.use(morgan('custom'));
    app.use(methodOverride());
    app.use(helmet());
    app.disable('X-powered-by');    
    app.use(security.ensureEnabledConsumers);

    Object.assign(app, {		
		main: knex({
			client: 'sqlite3',
			connection: {
				filename: '../shared/db/database.db'
			}
		})
	});

    app.use('/', routes(app, constants.v1));


    return app;
}