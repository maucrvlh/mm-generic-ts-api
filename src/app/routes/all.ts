import * as express from 'express';
import Constants from '../../config/constants';
import settings from '../../config/settings';
import {
    welcome,
    documentation,
    login,
    verify,
    logout,
    invalidEndpoint
} from '../controllers/all';
import { PageNotFoundException } from 'tjam-node-exceptions';

// Aqui devem ficar os imports de todos os configuradores
// de endpoints da API. 
// Como exemplo, nesta API, teremos rotas e controles
// relativas à manutenção de cadastros de processos.
// A sugestão é que todas as rotas relativas ao cadastro, edição, 
// exclusão de processos fiquem no arquivo routes/processos.ts
// assim como os controles respectivos, em controllers/processos.ts.
import * as processos from "./processos";

export namespace v1 {
    let router = express.Router();

    // Rotas definidas como padronizadas, presentes em todas
    // as APIs desenvolvidas seguindo este esquema.
    // A ideia é que toda API tenha as seguintes rotas:

    // https://<api>/
    // https://<api>/api/v1/
    // Rota básica, mostrando o APIid do serviço e o status.
    router.all('/', welcome);
    router.all(`/api/v1/`, welcome);
    router.all(`/api/v1${settings().system.docPath}`, welcome);

    // https://<api>/api/v1/login
    // Rota para autenticação do usuário no serviço de autenticação.
    // Está rota permite que o cliente que consome esta API possa
    // realizar o login através desta API, e esta se encarrega
    // de encaminhar a requisição à API de autenticação que já existe
    // e está disponível em https://services.tjam.jus.br:8101/
    // A requisição a este endpoint deve ser do tipo POST, passando como parâmetros
    // no body os campos username e password, com usuário e senha em texto claro,
    // ou credentials, com usuário e senha concatenados com um caractere :
    // no formato usuário:senha, codificados em base64.
    // Maiores detalhes sobre isto pode ser consultado no readme.
    router.all(`/api/v1/login`, login);

    // https://<api>/api/v1/verify
    // Middleware e rota para verificação de usuário logado.
    // Este middleware é usado como filtro para os endpoints que só podem ser
    // acessados por usuários autenticados.
    // Exemplo: a rota search definida logo abaixo só pode ser acessada
    // por usuário logado, logo a declaração destos endpoints dessa rota deve seguir a
    // estrutura: router.get('api/v1/search/list', verify, list);
    // No exemplo dado, toda requisição do tipo GET ao endpoint /api/v1/search/list
    // passará antes pelo verify, para verificar se o usuário está logado.
    // A verificação é feito pela API de autenticação, e verifica se o header
    // authorization está presente na requisição e se o seu valor corresponde
    // a um token de sessão válido no servidor Redis.
    // Se sim, verify retorna true, indicando usuário logado, do contrário false,
    // e uma das exceptions é retornada: InvalidHttpHeaderException, MissingHttpHeaderException
    // ou MissingTokenException, a depender do tipo de problema encontrado.
    // O cliente pode dar um GET em /verify para verificar se o token
    // presente no seu header authorization ainda é valido, 
    // mas seu propósito principal é servir de middleware para as 
    router.all(`/api/v1/verify`, verify);

    // https://<api>/api/v1/logout
    // Rota para quebra de sessão do usuário
    router.all(`/api/v1/logout`, logout);

    // https://<api>/api/v1/processos/<endpoints>
    // Aqui realmente começa a configuração das rotas específica desta API.
    // Como nesta API de exemplo só cuidaremos de registro de processos,
    // na linha abaixo é configurado no ExpressJS que tudo que for requisitado
    // ao endereço api/v1/processos/<qualquercoisa> deverá ter a requisição
    // encaminhada às rotas definidas em routes/processos.ts.
    // Lá em routes/processos.ts serão definidas outras rotas como a de criação,
    // edição, exclusão, etc. Aqui define-se apenas a "porta de entrada".
    // Por esta razão aqui é usado o método router.use() e não o método router.all()
    // ou router.get() ou router.post() das linhas anteriores, 
    // pois o use() diz ao expressjs para USAR as rotas definidas no 
    // routes/processos.ts e deixar para que este arquivo
    // configure os controllers correspondentes.
    //
    // ATENÇÃO:
    // Caso seja um requisito de negócio que todos os acessos ao endereço 
    // https://<api>/api/v1/processos/<endpoints> sejam feitos por usuários
    // autenticados, basta adicionar o método verify no segundo parâmetro da linha
    // abaixo, ficando router.use(`/api/v1/processos`, verify, processos.v1.routes());
    // Contudo, se somente ALGUNS endpoints do api/v1/processos necessitam de usuário
    // logado, deixe para incluir o verify nos endpoints lá em routes/processos.ts.
    router.use(`/api/v1/processos`, processos.v1.routes());

    export function routes(): express.Router {
        return router;
    }
}

// Como um exemplo didático, deixei abaixo a configuração das rotas
// relativas à versão 2 de algumas rotas que já existem na versão 1.
// Como explicado nos comentários do config/express.ts, a ideia principal
// é que dois endpoints similares existam, mas com implementações diferentes
// e mudando apenas o seu path, por ex.: api/v1/processos e api/v2/processos
// Cada endpoint retornando o JSON que o cliente necessita.
// No namespace abaixo apenas "reimplementamos" o endpoint de processos.
// Os outros, de login, welcome, docs, verify etc permanecem apenas no v1 da API.
export namespace v2 {
    let router = express.Router();

    router.use(`/api/v2/processos`, processos.v2.routes());

    export function routes(): express.Router {
        return router;
    }
}