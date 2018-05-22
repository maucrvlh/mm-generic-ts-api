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
                    SELECT P.VLCAUSA "valor", P.CDPROCESSO "codprocesso", P.CDPARTEATIVAPRINC "ativoprincipal", P.CDPARTEPASSIVPRINC "passivoprincipal", P.NUPROCESSO "processo", NOME.CDPESSOA "codparte", NOME.NMPESSOA "nome", TIPOPARTE.DECOMPTIPOPARTE "participacao", PESSOA.NUIDADE "idade", PARTE.FLSEGREDOJUSTICA "segredojustica", PARTE.TPPARTE "parte", PARTE.NUSEQPARTE "seqparte", PARTE.NUSEQPARTEREFER "seqparterefer",
                    PDOCCPF.NUDOCFORMATADO "cpf", PDOCOAB.NUDOCFORMATADO "oab", PDOCCNPJ.NUDOCFORMATADO "cnpj"
                    FROM SAJ.EFPGPROCESSO P 
                    INNER JOIN SAJ.EFPGPARTE PARTE ON PARTE.CDPROCESSO = P.CDPROCESSO 
                    INNER JOIN SAJ.ESAJNOME NOME ON  PARTE.CDPESSOA = NOME.CDPESSOA AND NOME.TPNOME = 'N'  
                    INNER JOIN SAJ.ESAJTIPOPARTE TIPOPARTE ON TIPOPARTE.CDTIPOPARTE = PARTE.CDTIPOPARTE 
                    INNER JOIN SAJ.ESAJPESSOA PESSOA ON PESSOA.CDPESSOA = PARTE.CDPESSOA 
                    LEFT OUTER JOIN SAJ.ESAJPESSOADOC PDOCOAB ON PDOCOAB.CDPESSOA = PARTE.CDPESSOA AND PDOCOAB.SGTIPODOCUMENTO = 'OAB'
                    LEFT OUTER JOIN SAJ.ESAJPESSOADOC PDOCCPF ON PDOCCPF.CDPESSOA = PARTE.CDPESSOA AND PDOCCPF.SGTIPODOCUMENTO = 'CPF'
                    LEFT OUTER JOIN SAJ.ESAJPESSOADOC PDOCCNPJ ON PDOCCNPJ.CDPESSOA = PARTE.CDPESSOA AND PDOCCNPJ.SGTIPODOCUMENTO = 'CNPJ'
                    WHERE 
                        P.FLTIPOCLASSE NOT IN (5) AND 
                        P.NUPROCESSO = ':processo'
                    ORDER BY PARTE.TPPARTE, PARTE.NUSEQPARTE, PARTE.NUSEQPARTEREFER DESC
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
                    select * from cnjbrasil.processo where numeroprocesso=':processo'
                `
            },
            insert: {},
            update: {},
            delete: {}
        },
    }
}