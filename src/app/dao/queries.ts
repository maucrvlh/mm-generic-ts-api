// Esta estrutura serve apenas para uma melhor organização.
// A ideia é separar as queries por comando (SELECT, INSERT, UPDATE, DELETE)
// e por schema de banco de dados (no caso do SAJ: PG, SG, NET).
//
// Contudo, nada impede que seja utilizada outra organização,
// sempre atentando para a referência feito em models/<modelos>.ts
// onde estas queries são chamadas.

export default {
    saj: {
        net: {
            select: {},
            insert: {},
            update: {},
            delete: {}
        },
        pg: {
            select: {
                queryDadosDoProcesso: `
                    `,

                queryGetBlob: `
                    
                    `
            },
            insert: {},
            update: {},
            delete: {}
        },
        sg: {
            select: {},
            insert: {},
            update: {},
            delete: {}
        },
        any: {
            select: {},
            insert: {},
            update: {},
            delete: {}
        }
    },
    projudi: {
        cnjbrasil: {
            select: {
                queryDadosProcesso: `                
                    
                `
            },
            insert: {},
            update: {},
            delete: {}
        },
    }
}