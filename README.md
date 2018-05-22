<h1 align="center">TJAM generic TS API</h1>

---

:fire: Estrutura base de APIs Node.js internas do TJAM.


## Minitutorial rápido
* 1 - clone o repositório do projeto na sua máquina

* 2 - faça a instalação do driver db2 conforme as instruções em [TJAM Node DB2 Helper](http://git.tjam.jus.br/local-node-modules/tjam-node-db2-helper)

* 3 - crie uma variável de ambiente `IBM_DB_HOME` apontando para o local onde você baixou o driver db2, exemplo:
    ```
    export IBM_DB_HOME=/home/mauricio/dev/env/projects/support/libs/db2/drivers/ibm/clidriver
    ```

* 4 - abra o arquivo `nodemon.json` deste projeto e altere o apontamento de `LD_LIBRARY_PATH` para o local onde você baixou o driver db2, seguido do diretório `lib`, exemplo:
    ```
    "LD_LIBRARY_PATH": "/home/mauricio/dev/env/projects/support/libs/db2/drivers/ibm/clidriver/lib"
    ```

* 5 - na raiz do projeto, execute:
    ```
    $ npm install 
    ou
    $ yarn
    ```

* 6 - após o término das instalações dos pacotes, rode o projeto:
    ```
    $ npm run start
    ou
    $ yarn start
    ```


## Endpoints
* Os endpoints implementados nesta versão inicial são:

- http://localhost:3001/

- http://localhost:3001/api

- http://localhost:3001/api/v1

- http://localhost:3001/api/v1/processos

- http://localhost:3001/api/v1/processos/details/0613608
    > Dados vindos do SQLite que está no repositório shared do projeto

- http://localhost:3001/api/v1/processos/saj/06001489620178040092
    > Consulta diretamente do banco do SAJ

- http://localhost:3001/api/v1/processos/projudi/100000001666806
    > Consulta diretamente do banco do Projudi


## Estrutura básica de diretórios de um projeto (modelo)

```
· Projeto
    · api_1
    · api_2
    · shared
```

## Estrutura básica de diretórios da api `api_1` (modelo, apenas; pode-se usar outras estruturas livremente)

```
· api_1
    · dist
    · node_modules
    · src
        · app
            · controllers
                ─ all.ts
                ─ controller1.ts
                ─ controller2.ts
                ─ controllerN.ts
            · dao
                ─ all.ts
                ─ queries.ts
                ─ sqlite.ts (se for usado no projeto um db sqlite)
            · routes
                ─ all.ts
                ─ endpoints1.ts
                ─ endpoints2.ts
                ─ endpointsN.ts
        · config
            ─ constants.ts
            ─ express.ts
            ─ settings.ts
        ─ index.ts
    · test
    ─ LICENSE
    ─ README.md
    ─ package.json
    ─ tsconfig.json
    ─ nodemon.json
        
```

## Premissas
... versionamento interno de endpoints e suas dependencias através de namespace ou classes. Aqui usei namespace.
... typescript como 'linguagem' padrão, facilitando a inclusão de devs que venham do paradigma OO
... responsabilidades das APIs
... segurança no consumo das APIs e identificação dos clientes (incluir proposta do TOTP)
... interação entre as APIs e das APIs com seus consumidores
... itens de configuração que mudam de acordo com o ambiente

## Estrutura explicada
... descrever a estrutura do projeto, das APIs do projeto, dos paths e arquivos internos
... explicar quais são permanentes, quais são específicos da API

## README
... propor um padrão de readme para os projetos

## Login
... explicar aqui como é feito o login de usuários via cliente -> API, os parâmetros que o cliente deve passar login, username ou credentials

## Controllers
... explicar que aqui os controllers podem ser únicos, ou podem ser dividos por função, ou mesmo pode sem empactados por um path com o nome da entidade (ex.: processos/add.ts; processos/del.ts; etc)

## O build
... breve explicação sobre o processo de build e o conteúdo do transpile

## PM2
... breve explicação desse process manager p/ nodejs e um exemplo de deploy

## TODOs
... lista de pendências.