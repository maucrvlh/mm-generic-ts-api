import settings from '../../config/settings';
import constants from '../../config/constants';
import { Request, Response, NextFunction } from 'express';
import icontrollers from '../interface/controllers';


const utils                     = require(settings().support+'/utils/log-utils')(settings());
const InvalidRequestException   = require(settings().support+'/exceptions/InvalidRequestException');
const GenericErrorException     = require(settings().support+'/exceptions/GenericErrorException');
const InvalidFormatException    = require(settings().support+'/exceptions/InvalidFormatException');
const validators                = require(settings().support+'/helpers/validators');

export default (app: any) => {
	let controller:icontrollers = { v1: null };

    let proceed = (v: any) => {
        if (settings().system.debug)
            utils.info(`Procedendo para a listagem.`);

        return Promise.resolve(v);
    }

    let list = (v: any) => {
        return new Promise((resolve, reject) => {
            app.db.main
                .from('generic')
                .select()
                .then((rows: any) => {
                    v.success = rows;
                    resolve(v);
                })
                .catch((err: any) => {
                    v.error = err;
                    v.error.message = err.message ? err.message : 'Não foi possível obter os dados.';
                    reject(v);
                });            
        });
    }

    let result = (v: any) => {
        if (v.success)
            v.res.status(200).json({status: 'success', records: v.success});
    }

    let error = (v: any) => v.next(v.error);

    controller.v1 = {
        list: (req: Request, res: Response, next: NextFunction) => {
            proceed({req: req, res: res, next: next, context: constants.v1})
                .then(list)
                .then(result)
                .catch(error)
                .catch((err) => {
                    next(new GenericErrorException('Erro interno: %s', err.toString()));
                });        
        }
    }
    
    return controller;
}