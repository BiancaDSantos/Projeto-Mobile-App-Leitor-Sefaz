import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProdutoEstoque } from '../types/estoque.type';

const ESTOQUE_STORAGE_KEY = '@app_estoque:produtos';

export function useEstoque() {
    
    const [produtos, setProdutos] = useState<ProdutoEstoque[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchProdutos = useCallback(async () => {
        setIsLoading(true);
        try {
            const storageData = await AsyncStorage.getItem(ESTOQUE_STORAGE_KEY);
            if (storageData) {
                setProdutos(JSON.parse(storageData));
            } else {
                setProdutos([]);
            }
        } catch (error) {
            console.error("Erro ao buscar produtos do storage", error);
        } finally {
            setIsLoading(false);
        }
    }, []);


    const adicionarProdutos = useCallback(async (novosProdutos: ProdutoEstoque[]) => {
        try {
            setProdutos((estoqueAtual) => {
                
                const estoqueAtualizado = [...estoqueAtual];

                novosProdutos.forEach((novoProduto) => {
                    
                    const nomeNormalizado = novoProduto.nome.trim().toLowerCase();

                    const indexExistente = estoqueAtualizado.findIndex(
                        (p) => p.nome.trim().toLowerCase() === nomeNormalizado
                    );

                    if (indexExistente >= 0) {
                        
                        const produtoExistente = estoqueAtualizado[indexExistente];

                        
                        const loteNovo = novoProduto.lotes[0];

                        
                        const novaQuantidadeTotal = produtoExistente.quantidadeTotal + novoProduto.quantidadeTotal;

                        
                        const valorTotalExistente = produtoExistente.quantidadeTotal * produtoExistente.custoMedio;
                        const valorTotalNovo = novoProduto.quantidadeTotal * novoProduto.custoMedio;
                        const novoCustoMedio = (valorTotalExistente + valorTotalNovo) / novaQuantidadeTotal;

                        
                        estoqueAtualizado[indexExistente] = {
                            ...produtoExistente,
                            quantidadeTotal: novaQuantidadeTotal,
                            custoMedio: novoCustoMedio,
                            lotes: [...produtoExistente.lotes, loteNovo]
                        };

                    } else {
                        
                        estoqueAtualizado.push(novoProduto);
                    }
                });

                
                AsyncStorage.setItem(ESTOQUE_STORAGE_KEY, JSON.stringify(estoqueAtualizado)).catch(
                    (err) => console.error("Erro ao salvar no AsyncStorage", err)
                );

                return estoqueAtualizado;
            });
        } catch (error) {
            console.error("Erro ao mesclar produtos", error);
            throw error;
        }
    }, []);

    const removerProduto = useCallback(async (idProduto: string) => {
    try {
      setProdutos((estoqueAtual) => {
        
        const estoqueAtualizado = estoqueAtual.filter((p) => p.id !== idProduto);
        
        
        AsyncStorage.setItem(ESTOQUE_STORAGE_KEY, JSON.stringify(estoqueAtualizado)).catch(
          (err) => console.error("Erro ao salvar no AsyncStorage após exclusão", err)
        );

        return estoqueAtualizado;
      });
    } catch (error) {
      console.error("Erro ao remover produto", error);
      throw error;
    }
  }, []);
    

    return {
        produtos,
        isLoading,
        fetchProdutos,
        adicionarProdutos,
        removerProduto
    };
}