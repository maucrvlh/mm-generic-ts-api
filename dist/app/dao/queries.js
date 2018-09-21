"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    saj: {
        net: {
            select: {},
            insert: {},
            update: {},
            delete: {}
        },
        pg: {
            select: {
                queryDadosDoProcesso: "\n                    SELECT P.VLCAUSA \"valor\", P.CDPROCESSO \"codprocesso\", P.CDPARTEATIVAPRINC \"ativoprincipal\", P.CDPARTEPASSIVPRINC \"passivoprincipal\", P.NUPROCESSO \"processo\", NOME.CDPESSOA \"codparte\", NOME.NMPESSOA \"nome\", TIPOPARTE.DECOMPTIPOPARTE \"participacao\", PESSOA.NUIDADE \"idade\", PARTE.FLSEGREDOJUSTICA \"segredojustica\", PARTE.TPPARTE \"parte\", PARTE.NUSEQPARTE \"seqparte\", PARTE.NUSEQPARTEREFER \"seqparterefer\",\n                    PDOCCPF.NUDOCFORMATADO \"cpf\", PDOCOAB.NUDOCFORMATADO \"oab\", PDOCCNPJ.NUDOCFORMATADO \"cnpj\"\n                    FROM SAJ.EFPGPROCESSO P \n                    INNER JOIN SAJ.EFPGPARTE PARTE ON PARTE.CDPROCESSO = P.CDPROCESSO \n                    INNER JOIN SAJ.ESAJNOME NOME ON  PARTE.CDPESSOA = NOME.CDPESSOA AND NOME.TPNOME = 'N'  \n                    INNER JOIN SAJ.ESAJTIPOPARTE TIPOPARTE ON TIPOPARTE.CDTIPOPARTE = PARTE.CDTIPOPARTE \n                    INNER JOIN SAJ.ESAJPESSOA PESSOA ON PESSOA.CDPESSOA = PARTE.CDPESSOA \n                    LEFT OUTER JOIN SAJ.ESAJPESSOADOC PDOCOAB ON PDOCOAB.CDPESSOA = PARTE.CDPESSOA AND PDOCOAB.SGTIPODOCUMENTO = 'OAB'\n                    LEFT OUTER JOIN SAJ.ESAJPESSOADOC PDOCCPF ON PDOCCPF.CDPESSOA = PARTE.CDPESSOA AND PDOCCPF.SGTIPODOCUMENTO = 'CPF'\n                    LEFT OUTER JOIN SAJ.ESAJPESSOADOC PDOCCNPJ ON PDOCCNPJ.CDPESSOA = PARTE.CDPESSOA AND PDOCCNPJ.SGTIPODOCUMENTO = 'CNPJ'\n                    WHERE \n                        P.FLTIPOCLASSE NOT IN (5) AND \n                        P.NUPROCESSO = ':processo'\n                    ORDER BY PARTE.TPPARTE, PARTE.NUSEQPARTE, PARTE.NUSEQPARTEREFER DESC\n                    ",
                queryGetBlob: "\n                    SELECT * FROM SAJ.EDIGIMAGEMDOC WHERE CDUSUINCLUSAO=':usuario' AND CDDOCUMENTO=':doc'\n                    "
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
                queryDadosProcesso: "                \n                    select * from cnjbrasil.processo where numeroprocesso=':processo'\n                "
            },
            insert: {},
            update: {},
            delete: {}
        },
    }
};
//# sourceMappingURL=queries.js.map