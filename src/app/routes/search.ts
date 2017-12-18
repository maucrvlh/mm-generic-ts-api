import * as express from 'express';
import constants from '../../config/constants';
import searchController from '../controllers/search';

export default (app: any, context: any) => {
    let router = express.Router();
    let controller = app.controllers;

    if (context == constants.v1) {
        router.get('/', searchController(app).v1.list);
    }
    return router;
}