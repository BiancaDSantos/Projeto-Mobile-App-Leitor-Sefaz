export interface LoteEntrada {

    id: string;
    dataEntrada: string;
    quantidade: number;
    valorUnitario: number;

}

export interface ProdutoEstoque {

    id: string;
    nome: string;
    icone?: string;
    quantidadeTotal: number;
    custoMedio: number;
    lotes: LoteEntrada[];

}

export const formatarMoeda = (valor: number): string => {

    return valor.toFixed(2).replace('.', ',');

};

export interface ProdutoSefaz {

    nome: string;
    codigoSefaz: string;
    quantidade: number;
    valorUnitario: number;

}

export interface EmitenteSefaz {

    nome: string;
    cnpj: string;

}

export interface DadosExtracaoSefaz {

    produtos: ProdutoSefaz[];
    emitente: EmitenteSefaz;
    
}