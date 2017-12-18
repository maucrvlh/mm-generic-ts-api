<h1 align="center">TJAM generic TS API</h1>

---

:fire: Estrutura base de APIs Node.js internas do TJAM.

## Features
* Compatível com ES5+
* Compatível com Node.js 4+
* Compatível com express@latest / express.Router
* Escrito em TypeScript 2+


## Utilização
- Clone o repositório
```
$ mkdir -p /home/projects/projetoX && cd /home/projects/projetoX
$ git clone <repo> api
$ cd api
```
- Install das dependências de build e dev dentro do repo clonado (no exemplo anterior, /home/projects/projetoX/api)
```
$ yarn
```

- Transpile e rode o server
```
$ tsc -w && ./node_modules/bin/nodemon dist/index.js
```