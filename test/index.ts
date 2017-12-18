import http from 'http';
import assert from 'assert';
import { describe, it } from 'mocha';

import '../dist/index';

let native = {
    response: res => {
        return new Promise((resolve, reject) => {        
            res.setEncoding('utf8');
            let rawData = '';
            res.on('data', (chunk) => { rawData += chunk; });
            res.on('end', () => {
                try {
                    resolve(JSON.parse(rawData));                
                } catch (e) {
                    reject(e.message);
                }
            });
        });
    }
}

describe('Teste do server', function() {
    it('Deve retornar 200 em GET /', done => {
        http.get('http://localhost:3000/', res => {
            assert.equal(200, res.statusCode);
            done();
        })
    });
    it('Deve ter um json com a prop status = success em GET /', done => {
        http.get('http://localhost:3000/', res => {
            native.response(res)
                .then((data: any) => {
                    assert.equal('success', data.status);
                })
                .catch((err) => {
                    assert.throws(err);
                });
            done();
        })
    });
});