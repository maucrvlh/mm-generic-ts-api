<h1 align="center">TJAM generic TS API</h1>

---

:fire: Estrutura base de APIs Node.js internas do TJAM.

## Features
* Compatível com ES5+
* Compatível com Node.js 4+
* Compatível com express@latest / express.Router
* Escrito em TypeScript 2+


## Fork
- Clone o repositório
```
$ mkdir -p /home/projects/projetoX
$ cd /home/projects/projetoX
$ git clone <repo> api
$ cd api
```
- Adicione o endereço do seu projeto e o endereço do Projeto Base
```
$ git remote rm origin
$ git remote add origin <seu_projeto.git>
$ git remote add upstream <url_do_projeto_original.git>
```
- Atualizando seu projeto com base no projeto original
```
$ git fetch upstream
$ git checkout master
$ git merge upstream/master
```

- Install das dependências de build e dev dentro do repo clonado (no exemplo anterior, /home/projects/projetoX/api)
```
$ yarn // ou npm install
```

- Transpile e rode o server
```
$ tsc -w 
$ yarn start // ou npm start
```