import { useState, useCallback } from 'react';
import { ProdutoEstoque } from '@/types/estoque.type';


export function useEstoque() {
  const [produtos, setProdutos] = useState<ProdutoEstoque[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProdutos = useCallback(async () => {
    setIsLoading(true);
    try {

      const dadosMockados: ProdutoEstoque[] = [
        {
          id: '1',
          nome: 'Café 3 Corações',
          icone: '☕',
          quantidadeTotal: 20,
          custoMedio: 11.00,
          lotes: [
            { id: 'l1', dataEntrada: '01/06', quantidade: 10, valorUnitario: 10.00 },
            { id: 'l2', dataEntrada: '08/06', quantidade: 10, valorUnitario: 12.00 },
          ]
        },
        {
          id: '2',
          nome: 'Açúcar Refinado União',
          icone: '🍬',
          quantidadeTotal: 70,
          custoMedio: 4.59,
          lotes: [
            { id: 'l3', dataEntrada: '10/06', quantidade: 50, valorUnitario: 4.50 },
            { id: 'l4', dataEntrada: '15/06', quantidade: 20, valorUnitario: 4.80 },
          ]
        }
      ];
      setProdutos(dadosMockados);
    } catch (error) {
      console.error("Erro ao buscar produtos", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    produtos,
    isLoading,
    fetchProdutos
  };
}