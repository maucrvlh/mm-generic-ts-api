import * as http from 'http';
import * as utils from 'tjam-node-log-utils';
import settings from './config/settings';
import configServer from './config/express';

// Aqui é definida a porta que a API usará para ouvir
// as requisições que chegarem ao servidor. 
// Atenção: esta porta deve ser exclusiva desta API,
// não sendo possível utilizá-la em duas diferentes.
const PORT = 3001;

// Aqui é onde se diz ao node para efetivamente
// criar o servidor com base nas configurações
// definidas em config/express.ts, e começar a ouvir (listen())
// na porta definida na constante PORT

http.createServer(configServer()).listen(PORT, () => {
    utils.info(`${settings().system.name} rodando na porta ${PORT}.`);
});