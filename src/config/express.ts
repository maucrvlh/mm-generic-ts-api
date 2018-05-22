import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as helmet from 'helmet';
import * as methodOverride from 'method-override';
import * as knex from 'knex';
import * as utils from 'tjam-node-log-utils';
import settings from './settings';
import constants from './constants';
import * as all from '../app/routes/all.js';
import { invalidEndpoint } from '../app/controllers/all';
import { ConsumerNotAllowedException, PageNotFoundException } from 'tjam-node-exceptions';
// import { initSqliteDatabase } from './sqlite';

export default function () {
    let app = express();

    // Informa à lib tjam-node-log-utils as configurações desta API
    // como nome, identificação, versão, endereço dos docs, etc.
    // Necessário para que a lib possa fazer o log corretamente, com
    // a devida identificação da API.
    utils.setSettings(settings());


    // Aqui são definidos vários middlewares do próprio ExpressJS
    // Para mais detalhes, consultar doc em: http://expressjs.com/
    app.enable('trust proxy');
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(methodOverride());
    app.use(helmet());
    app.disable('X-powered-by');


    // Aqui configura outro middleware no ExpressJS para realizar o log da aplicação.
    // Este log é feito pela lib tjam-node-log-utils.
    // Sempre que houver uma requisição à API, no console do servidor será exibido um log 
    // desta ação.
    app.use(utils.plugin);


    // Este middleware evita que uma pessoa mal-intencionada entre no sistema que usa esta API
    // copie o endereço da API (ex.: https://sistemas.tjam.jus.br/services/autenticador/api/v1) e
    // tente fazer requisições para a mesma.
    // Basicamente o código abaixo analisa a header referrer que o navegador envia à API no momento
    // da requisição.
    // A configuração dos referrers permitidos fica em config/settings, na propriedade
    // permissions.consumer.hostnames. Se este array estiver vazio, o sistema permite qualquer
    // cliente requisitar dados direto da API (inseguro!)
    app.use((req, res, next) => {
        if (settings().permissions) {
            if (settings().permissions.consumer) {
                if (settings().permissions.consumer.hostnames && settings().permissions.consumer.hostnames.length > 0) {
                    if (!req.get('referrer') || !(settings().permissions.consumer.hostnames.some((el, i, a) => !!~req.get('referrer').indexOf(el))))
                        return next(new ConsumerNotAllowedException());
                }
            }
        }
        next();
    });


    // Caso seja necessário utilizar um banco SQLITE no projeto,
    // é precisa inicializar a instância do knex (lib padrão para sqlite3).
    // A linha abaixo chama o método initSqliteDatabase que está em
    // config/sqlite.ts e inicializa uma nova instância do banco sqlite.
    // Caso não haja necessidade de usar um banco sqlite no seu projeto, simplesmente
    // remova a linha abaixo.
    // initSqliteDatabase();


    // Aqui se associa todas as rotas da
    // versão 1 (v1) definidas no routes/all.ts 
    // à rota raiz '/'.
    app.use('/', all.v1.routes());


    // A título de exemplo, a linha abaixo define as rotas disponíveis
    // na versão 2 desta API. 
    // A ideia de separar as rotas em v1, v2, v3 etc...
    // é separar as implementações por versão de API.
    // Por exemplo: suponha que hoje a API forneça o endpoint https://<api>/apí/v1/processos
    // que retorne uma lista de processos contendo apenas o número de cada processo
    // e atende bem os requisitos dos clientes que utilizam esta API.
    // Em outro momento, um novo cliente precisa utilizar também esta API, mas necessita
    // que a lista de processos contenha apenas o foro e a vara aos quais foram
    // distribuídos.
    // Alterar a implementação do endpoint não é a solução ideal, pois assim não atenderia
    // mais os clientes que já utilizam a API com o endpoint retornando a lista de número de processos.
    // Nesta situação, a melhor solução seria criar uma nova rota, v2 por exemplo, e reimplementar
    // o método de listagem de processos para retornar aquilo que os novos clientes da API precisam.
    // Dessa forma, ao acessar https://<api>/api/v2/processos, a API chamará a implementação das rotas de
    // v2, retornando a lista de processos com vara e foro, e permaneceria fornecendo o mesmo endpoint
    // para v1, retornando apenas a lista de processos e seus respectivos números.
    app.use('/', all.v2.routes());



    // Esta configuração permite que o ExpressJS responda
    // ao cliente consumidor com uma exception do tipo PageNotFoundException
    // caso o endpoint requisitado não exista.
    // Ex.: cliente deu um GET em <api>/api/v1/juizes/find
    // Esta rota não existe nesta API. Logo, a API retorna ao cliente
    // consumidor a exceção de página não encontrada.
    // No bloco if abaixo, é feita uma verificação sobre se a API está rodando
    // em ambiente de desenvolvimento ou produção.
    // Quando roda em desenvolvimento, a exceção retornada inclui alguns detalhes a mais
    // como a stack do erro, os nomes dos arquivos em pilha, códigos de erros, etc.
    // Se for produção, a exceção retornada contém menos informações críticas, somente
    // o essencial para que o cliente consumidor saiba que a operação falhou.
    // Estas linhas devem ser as últimas deste arquivo, pois o ExpressJS faz
    // a varredura das rotas de forma sequencial.
    // No geral, estas linhas não precisam ser alteradas.
    app.use((req, res, next) => {
        let err = new PageNotFoundException('O REST end point não pôde ser encontrado. Consulte a documentação em /docs.', 404);
        next(err);
    });

    if (process.env.NODE_ENV === 'development') {
        app.use(invalidEndpoint.detailed);
    }

    app.use(invalidEndpoint.concise);


    return app;
}