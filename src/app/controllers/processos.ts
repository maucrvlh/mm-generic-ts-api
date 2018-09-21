import settings from '../../config/settings';
import constants from '../../config/constants';
import * as utils from 'tjam-node-log-utils';
import { Request, Response, NextFunction } from 'express';
import { GenericErrorException } from 'tjam-node-exceptions';
import { Validation } from 'tjam-node-toolbox';
import meuBancoSqlite from '../dao/sqlite';
import * as dao from '../dao/all';

interface IRequestResponse {
    req: Request;
    res: Response;
    next: NextFunction;
    temp?: any;
    success?: any;
    error?: any;
}

// Dentro do namespace v1 ficam os controladores da aplicação, o coração
// da API. Aqui vão as implementações dos métodos que foram chamados nas
// configurações de endpoints vistos no routes/controllers.ts.
// A ideia do namespace é separar as implementações por versão de API.
// Por exemplo: suponha que hoje a API forneça o endpoint https://<api>/apí/v1/processos
// que retorne uma lista de processos contendo apenas o número de cada processo
// e atende bem os requisitos dos clientes que utilizam esta API.
// Em outro momento, um novo cliente precisa utilizar também esta API, mas necessita
// que a lista de processos contenha apenas o foro e a vara aos quais foram
// distribuídos.
// Alterar a implementação do endpoint não é a solução ideal, pois assim não atenderia
// mais os clientes que já utilizam a API com o endpoint retornando a lista de número de processos.
// Nesta situação, a melhor solução seria criar um novo namespace, v2 por exemplo, e reimplementar
// o método de listagem de processos para retornar aquilo que os novos clientes da API precisam.
// Dessa forma, ao acessar https://<api>/api/v2/processos, a API chamará a implementação do namespace
// v2, retornando a lista de processos com vara e foro, e permaneceria fornecendo o mesmo endpoint
// para v1, retornando apenas a lista de processos e seus respectivos números.
export namespace v1 {
    function proceed(msg: string, v: IRequestResponse): Promise<IRequestResponse> {
        return new Promise((resolve, reject) => {
            if (settings().system.debug)
                utils.info(msg);
            resolve(v);
        });
    }

    // Esta função está sendo exportada pois será usada no exemplo
    // do namespace v2 no final deste script.
    export function getAllProcessFromLocalDatabase(v: IRequestResponse): Promise<IRequestResponse> {
        return new Promise((resolve, reject) => {
            meuBancoSqlite()
                .from('processos')
                .select()
                .then((rows: any) => {
                    v.temp = rows;
                    resolve(v);
                })
                .catch((err: any) => {
                    v.error = new GenericErrorException(`Não foi possível obter os dados do banco de processos. Mensagem retornada pelo driver: ${err.toString()}`);
                    reject(v);
                });
        });
    }

    function getProcessDetails(v: IRequestResponse): Promise<IRequestResponse> {
        
        // Considerando que o cliente requisitou GET /api/v1/processos/details/0613608
        // a linha abaixo obtém do parâmetro "processo" o número do processo
        let numeroProcesso = v.req.params.processo;

        return new Promise((resolve, reject) => {
            meuBancoSqlite()
                .from('processos')
                .select()
                .where({numero: numeroProcesso})
                .then((rows: any) => {
                    v.success = rows;
                    resolve(v);
                })
                .catch((err: any) => {
                    v.error = new GenericErrorException(`Não foi possível obter os dados do banco de processos. Mensagem retornada pelo driver: ${err.toString()}`);
                    reject(v);
                });
        });
    }

    function getProcessDetailsFromSaj(v: IRequestResponse): Promise<IRequestResponse> {
        return new Promise((resolve, reject) => {
            let processo = v.req.params.processo;
            let filter = { processo: processo }
            dao.v1.processFromSaj(filter)
                .then(result => {
                    v.success = result 
                    resolve(v);
                })
                .catch(error => {
                    v.error = new GenericErrorException(`Ocorreu um erro ao consultar o processo no SAJ: ${error.toString()}`);
                    reject(v);
                });
        });        
    }

    function getBlobDataFromSaj(v: IRequestResponse): Promise<IRequestResponse> {
        return new Promise((resolve, reject) => {
            let filter = { usuario: 'M67008', doc: '45942229' }
            dao.v1.blobFromSaj(filter)
                .then(result => {
                    v.success = result 
                    resolve(v);
                })
                .catch(error => {
                    v.error = new GenericErrorException(`Ocorreu um erro ao consultar o processo no SAJ: ${error.toString()}`);
                    reject(v);
                });
        });        
    }


    function getProcessDetailsFromProjudi(v: IRequestResponse): Promise<IRequestResponse> {
        return new Promise((resolve, reject) => {
            let processo = v.req.params.processo;
            let filter = { processo: processo }
            dao.v1.processFromProjudi(filter)
                .then(result => {
                    v.success = result 
                    resolve(v);
                })
                .catch(error => {
                    v.error = new GenericErrorException(`Ocorreu um erro ao consultar o processo no Projudi: ${error.toString()}`);
                    reject(v);
                });
        });        
    }

    function getListFromResult(v: IRequestResponse): Promise<IRequestResponse> {
        return new Promise((resolve, reject) => {
            let list = (v.temp as Array<object>).map((e: {numero: string}) => e.numero);
            v.success = list;
            resolve(v);
        });
    }

    function result(v: IRequestResponse): void {
        if (v.success)
            v.res.status(200).json({status: 'success', records: v.success});
        else
            utils.error('O atributo success não foi configurado no objeto propagado!');
    }

    function error(v: IRequestResponse): void {
        v.next(v.error);
    }


    // A partir daqui ficam os métodos que são exportados
    // e referenciados nos scripts de route em routes/*.ts
    // O método list() abaixo começa pelo método proceed(),
    // que nada mais faz que logging no console dizendo a 
    // ação que está sendo executada no momento,
    // seguindo para o método getAllProcessFromLocalDatabase()
    // que consulta todos os processos do banco de dados local,
    // e depois joga o resultado da consulta para o método 
    // result, que enviará em formato json para o cliente 
    // que requisitou.
    // Caso algum erro tenha ocorrido em algum passo anterior,
    // o catch() fica encarregado de jogar a mensagem de erro
    // para o método error().
    // Caso ocorra um erro no retorno do erro (sim, pode ocorrer),
    // o último catch é acionado, lançando um next() com a
    // exception passada por parâmetro.
    // Note que a estrutura e o encadeamento dos métodos é parecido
    // para todos métodos abaixo.
    // Este padrão, claro, pode ser adaptado como você quiser, esta
    // é só uma proposta e que é seguida na maioria das APIs que
    // já foram desenvolvidas em nodejs no tjam e tem funcionado
    // bem. ;)

    export function list(req: Request, res: Response, next: NextFunction) {
        proceed('procedendo p/ a listagem de processos no banco de dados local.', { req, res, next })
            .then(getAllProcessFromLocalDatabase)
            .then(getListFromResult)
            .then(result)
            .catch(error)
            .catch((err: any) => {
                next(new GenericErrorException('Erro interno: %s', err.toString()));
            });
    }  
    
    export function details(req: Request, res: Response, next: NextFunction) {
        proceed('procedendo p/ os detalhes do processo.', { req, res, next })
            .then(getProcessDetails)
            .then(result)
            .catch(error)
            .catch((err: any) => {
                next(new GenericErrorException('Erro interno: %s', err.toString()));
            });
    }  

    export function getFromSaj(req: Request, res: Response, next: NextFunction) {
        proceed('procedendo p/ obtenção do processo no SAJ.', { req, res, next })
            .then(getProcessDetailsFromSaj)
            .then(result)
            .catch(error)
            .catch((err: any) => {
                next(new GenericErrorException('Erro interno: %s', err.toString()));
            });
    }

    export function getBlob(req: Request, res: Response, next: NextFunction) {
        proceed('procedendo p/ obtenção do processo no SAJ.', { req, res, next })
            .then(getBlobDataFromSaj)
            .then(result)
            .catch(error)
            .catch((err: any) => {
                next(new GenericErrorException('Erro interno: %s', err.toString()));
            });
    }

    export function getFromProjudi(req: Request, res: Response, next: NextFunction) {
        proceed('procedendo p/ obtenção do processo do Projudi.', { req, res, next })
            .then(getProcessDetailsFromProjudi)
            .then(result)
            .catch(error)
            .catch((err: any) => {
                next(new GenericErrorException('Erro interno: %s', err.toString()));
            });
    }
    
    export function save(req: Request, res: Response, next: NextFunction) {
        proceed('procedendo p/ os detalhes do processo.', { req, res, next })
            .then(getAllProcessFromLocalDatabase)
            .then(result)
            .catch(error)
            .catch((err: any) => {
                next(new GenericErrorException('Erro interno: %s', err.toString()));
            });
    }

    export function del(req: Request, res: Response, next: NextFunction) {
        proceed('procedendo p/ os detalhes do processo.', { req, res, next })
            .then(getAllProcessFromLocalDatabase)
            .then(result)
            .catch(error)
            .catch((err: any) => {
                next(new GenericErrorException('Erro interno: %s', err.toString()));
            });
    }

    export function update(req: Request, res: Response, next: NextFunction) {
        proceed('procedendo p/ os detalhes do processo.', { req, res, next })
            .then(getAllProcessFromLocalDatabase)
            .then(result)
            .catch(error)
            .catch((err: any) => {
                next(new GenericErrorException('Erro interno: %s', err.toString()));
            });
    }
}



// Aqui é a implementação da versão 2 do endpoint api/v2/processos
// Note que aqui foi reescrito apenas o método getListFromResult, 
// que tem uma implementação diferente do getListFromResult do v1 acima.
// Este método depende do getAllProcessFromLocalDatabase() que foi chamado
// a partir do v1, pois não foi preciso alterar sua implementação. Apenas precisou
// ser exportado com a diretiva 'export' antes da assinatura, como pode ser
// visto na implementação acima.
//
// Em resumo: a ideia é que só fique na v2 o que tiver que ser reimplementado.
// O que não precisar ser reimplementado, continua na v1 e apenas o importa
// caso seja necessário.
//
// Aqui também é apenas uma proposta. Não é regra. 
// Poderíamos usar outro script, processos_v2.ts por exemplo,
// para implementar os métodos da v2, ou mesmo criar uma classe etc.
// Fica a critério do dev. Este formato tem atendido bem até o momento. ;)


export namespace v2 {
    function proceed(msg: string, v: IRequestResponse): Promise<IRequestResponse> {
        return new Promise((resolve, reject) => {
            if (settings().system.debug)
                utils.info(msg);
            resolve(v);
        });
    }

    function getListFromResult(v: IRequestResponse): Promise<IRequestResponse> {
        return new Promise((resolve, reject) => {
            let list = (v.temp as Array<object>).map((e: {numero: string, foro: string, vara: string}) => { return { numero: e.numero, foro: e.foro, vara: e.vara } });
            v.success = list;
            resolve(v);
        });
    }

    function result(v: IRequestResponse): void {
        if (v.success)
            v.res.status(200).json({status: 'success', records: v.success});
        else
            utils.error('O atributo success não foi configurado no objeto propagado!');
    }

    function error(v: IRequestResponse): void {
        v.next(v.error);
    }

    export function list(req: Request, res: Response, next: NextFunction) {
        proceed('procedendo p/ a listagem de processos no banco de dados local.', { req, res, next })
            .then()
            .then(v1.getAllProcessFromLocalDatabase)
            .then(result)
            .catch(error)
            .catch((err: any) => {
                next(new GenericErrorException('Erro interno: %s', err.toString()));
            });
    }  
}