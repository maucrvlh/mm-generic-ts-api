// Aqui ficam constantes que serão usadas em duas ou mais partes da API
// A ideia principal é precisar repetir código em vários controllers, ou models, etc.
// Centralizando estas constantes aqui, depois só será necessário importa-los com
// import * as constants from './constants';
// As únicas constantes obrigatória aqui são INVALID_HTTP_HEADER,
// MISSING_HTTP_HEADER e v1, que guarda a string que representa a versão 1
// e será usada nos controllers da versão 1 desta API.
// Se, por ventura, houver a necessidade de uma nova versão desta mesma API,
// basta acrescentar a v2: 'v2' e nas rotas e controllers implementar os métodos desta versão 2,
// deixando as rotas e métodos da versão 1 intactas.
// Esta é uma boa prática no desenvolvimento de APIs, pois possibilita que uma mesma API sirva
// tanto os clientes que a consomem com novas implementações quando os clientes que a consomem
// com os endpoints legados
export default {
    INVALID_HTTP_HEADER: 1004,
	MISSING_HTTP_HEADER: 1005,
    v1: 'v1',
    v2: 'v2'
}