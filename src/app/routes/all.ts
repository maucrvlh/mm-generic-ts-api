import * as express from 'express';
import Constants from '../../config/constants';
import settings from '../../config/settings';
import { 
    welcome, 
    documentation,
    login,
    verify,
    logout,
    session,
    invalidEndpoint
} from '../controllers/commons';
import search from "./search";

const PageNotFoundException = require(settings().support+'/exceptions/PageNotFoundException');

export default (app: any, context: any) => {
    let router = express.Router();
    
    if (context == Constants.v1) {

        let v1 = `${settings().system.basePath}/${Constants.v1}`;

        router.all('/', welcome);
        router.all(`${v1}/`, welcome);
        router.all(`${v1}${settings().system.docPath}`, welcome);

        router.all(`${v1}/login`, login);
        router.all(`${v1}/verify`, verify);
        router.all(`${v1}/logout`, logout);

        router.all(`${v1}/session`, verify, session);
        

        router.use(`${v1}/search`, verify, search(app, context));

        router.use((req, res, next) => {
            let err = new PageNotFoundException('O REST end point não pôde ser encontrado. Consulte a documentação em /docs.', 404);
            next(err);
        });

        if (app.get('env') === 'development') {
            router.use(invalidEndpoint.detailed);
        }

        router.use(invalidEndpoint.concise);
    }
    return router;
}