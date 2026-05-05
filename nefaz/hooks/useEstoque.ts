import { useState, useCallback } from 'react';
import { Product } from '../types/Produto';

export function useEstoque() {
  const [produtos, setProdutos] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProdutos = useCallback(async () => {
    setIsLoading(true);
    try {
      // 🚧 FUTURO: Lógica do AsyncStorage / SQLite aqui
      const dadosMockados: Product[] = [
        { id: '1', nome: 'CAFÉ TORRADO E MOÍDO 500G', quantidade: 2, valorUnitario: 15.90, valorTotal: 31.80 },
        { id: '2', nome: 'LEITE INTEGRAL 1L', quantidade: 12, valorUnitario: 4.50, valorTotal: 54.00 },
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