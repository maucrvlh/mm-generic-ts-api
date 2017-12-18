import * as http from 'http';
import configServer from './config/express';

const PORT = 3001;

http.createServer(configServer()).listen(PORT, () => {
    console.log(`Server running at port ${PORT}.`);
});