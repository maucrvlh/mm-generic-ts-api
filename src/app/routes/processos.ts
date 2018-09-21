import * as express from 'express';
import constants from '../../config/constants';
import * as processosController from '../controllers/processos';
import { verify } from '../controllers/all';

// Config dos endpoints da versão 1 relativos à manutenção 
// de cadastro dos processos, como o endpoint de cadastro, de
// edição, de exclusão, de listagem, etc.
// Para um aprofundamento de como funciona a criação e
// configuração de rotas, veja http://expressjs.com/en/guide/routing.html

export namespace v1 {
    let router = express.Router();

    // Quando o cliente consumidor der um GET em <api>/api/v1/processos/
    // O ExpressJS cairá nesta configuração e executará
    // dentro do processosController o método list(), que está definido
    // no atributo v1 do objeto retornado.
    // Apesar de estar apenas a barra na configuração da rota, lembre-se
    // que lá em routes/all.ts dissemos ao ExpressJS para usar este script processos.ts
    // para definir as rotas abaixo de /processos, então tudo que for definido aqui
    // estará precedido com o "/processos". No caso da rota barra (raiz), o ExpressJS
    // interpretará como sendo a rota "/processos/" ou apenas "/processo".
    //
    // Geralmente as listagens podem ser acessadas por qualquer usuário,
    // sem necessariamente estar logado.
    // Atenção: isto não é regra. Caso seja um endpoint privativo de usuários
    // autenticados, USE O VERIFY!
    //
    // Todas as rotas definidas aqui podem ser requisitadas com querystring,
    // que são parâmetros que vão na própria URL e servem para "filtrar" o resultado
    // da listagem ainda no back-end.
    // Normalmente sua estrutura segue o padrão ?chave=valor.
    // Então, é possível requisitar GET api/v1/processos/?foro=1&vara=2
    // para filtrar processos do foro 1 e vara 2. A implementação deste filtro
    // fica a cargo do programador, e deve estar no controlador que corresponde ao controle
    // de processos, no caso: controllers/processos.ts.
    router.get('/', processosController.v1.list);

    // Endpoint para detalhes de um processo específico,
    // identificado pelo parâmetro :processo.
    // Então quando o cliente requisitar GET api/v1/processos/details/10089
    // serão retornados os detalhes do processo 10089.
    // Atenção: não confundir PARÂMETRO de requisição com QUERYSTRING
    // explicado nos comentários do endpoint anterior.
    // Os PARÂMETROS DEVEM estar na configuração da rota, como visto abaixo,
    // já as querystrings não aparecem na configuração da rota.
    // No controller será visto de forma mais detalhada a utilização dos dois.
    // Mais sobre routing em: http://expressjs.com/en/guide/routing.html
    router.get('/details/:processo', processosController.v1.details);

    // Endpoint para consulta de um processo específico, no banco do SAJ,
    // identificado pelo parâmetro :processo.
    // Rota para exemplificar como seria uma consulta a um banco DB2
    // usando o módulo tjam-node-db2-helper.
    // Quando o cliente requisitar GET /api/v1/processos/saj/<numero do processo>
    // serão retornados os detalhes do processo vindos direto do servidor
    // de banco do SAJ (DB2).
    router.get('/saj/:processo', processosController.v1.getFromSaj);


    // Endpoint para consulta de um registro BLOB diretamenteo
    // do banco do SAJ.
    // Quando o cliente requisitar GET /api/v1/processos/blob
    // serão retornados os dados BLOB da tabela EDIGIMAGEMDOC 
    // de banco do SAJ (DB2).
    router.get('/blob', processosController.v1.getBlob);

    // Endpoint para consulta de um processo específico, no banco do Projudi,
    // identificado pelo parâmetro :processo.
    // Rota para exemplificar como seria uma consulta a um banco PostgreSQL
    // usando o módulo tjam-node-pg-helper.
    // Quando o cliente requisitar GET /api/v1/processos/projudi/<numero do processo>
    // serão retornados os detalhes do processo vindos direto do servidor
    // de banco do Projudi (PostgreSQL).
    router.get('/projudi/:processo', processosController.v1.getFromProjudi);

    // Endpoint para cadastro de um novo processo.
    // Note que o endereço é apenas a barra /.
    // Conforme as melhores práticas http descritas nos RFCs
    // correlatos e bem explicados neste artigo de leitura muito recomendada
    // https://medium.com/clebertech/o-guia-definitivo-para-constru%C3%A7%C3%A3o-de-apis-rest-470d0c885fe1
    // se estamos lidando com a entidade processos, e já estamos no endereço /processos
    // e queremos incluir um novo processo, não faz sentido ser um endpoint como
    // /processos/novo ou /processos/cadastro etc. Destas formas funcionam, mas como
    // boa prática o melhor é deixar apenas /processos e mudar apenas o VERBO HTTP para
    // a ação pretendida. No caso de inclusão de um novo registro, o recomendado é se usar
    // o verbo POST para /processos. 
    // GET /processos "pega" a lista de processos, POST /processos "posta, envia, cadastra" 
    // um novo processo, passando seus dados pelo body da requisição, PUT /processos/:processo "atualiza"
    // um processo identificado pelo parâmetro :processo e DELETE /processos/:processo deleta o
    // processo identificado pelo parâmetro :processo.
    //
    // Atenção: aqui a regra é que este tipo de ação seja feito apenas por usuários AUTENTICADOS,
    // logo, é necessário incluir o verify como segundo parâmetro do método router.post(), como segue:
    router.post('/', verify, processosController.v1.save);

    // Endpoint para exclusão de um processo identificado pelo
    // parâmetro :processo.
    // Ao requisitar DELETE /processos/10855 a API removerá do seu
    // banco de dados o processo 10855.
    //
    // Note que assim como o cadastro, exclusão também deve ser restrito
    // apenas a usuários autenticados, sendo por isso incluído o verificador
    // no segundo parâmetro do método router.delete(), como segue:
    router.delete('/:processo', verify, processosController.v1.del);

    // Endpoint para edição de um processo identificado pelo
    // parâmetro :processo.
    // Ao requisitar PUT /processos/11666 a API atualizará o processo
    // com os dados que forem enviados pelo body da requisição.
    //
    // Novamente, uma rota com verify para checkar se é usuário autenticado.
    // Muita atenção para não esquecer deste verificador neste tipo
    // de endpoint!
    router.put('/:processo', verify, processosController.v1.update);

    export function routes(): express.Router {
        return router;
    }
}


// Config dos endpoints da versão 2.
// Supondo que foi requisitado uma "reimplementação" da
// listagem de processos, esta nova implementação ficaria
// disponível na versão 2: api/v2/processos
// Exemplo:

export namespace v2 {
    let router = express.Router();

    router.get('/', processosController.v2.list);

    export function routes(): express.Router {
        return router;
    }
}