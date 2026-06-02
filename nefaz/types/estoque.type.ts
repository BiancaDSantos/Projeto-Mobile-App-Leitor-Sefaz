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