import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProdutoEstoque } from '../types/estoque.type';

const ESTOQUE_STORAGE_KEY = '@app_estoque:produtos';

export function useEstoque() {
    
    const [produtos, setProdutos] = useState<ProdutoEstoque[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Busca os produtos salvos no armazenamento local
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

    // Adiciona novos produtos aplicando a regra de agrupamento e custo médio
    const adicionarProdutos = useCallback(async (novosProdutos: ProdutoEstoque[]) => {
        try {
            setProdutos((estoqueAtual) => {
                // Criamos uma cópia do estado atual para não mutar o array original diretamente
                const estoqueAtualizado = [...estoqueAtual];

                novosProdutos.forEach((novoProduto) => {
                    // Normalizamos o nome para evitar que "Café" e " café " criem cards separados
                    const nomeNormalizado = novoProduto.nome.trim().toLowerCase();

                    const indexExistente = estoqueAtualizado.findIndex(
                        (p) => p.nome.trim().toLowerCase() === nomeNormalizado
                    );

                    if (indexExistente >= 0) {
                        // O PRODUTO JÁ EXISTE: Vamos agrupar no lote
                        const produtoExistente = estoqueAtualizado[indexExistente];

                        // Assumimos que o novo produto extraído da nota fiscal vem com 1 lote
                        const loteNovo = novoProduto.lotes[0];

                        // 1. Somar quantidades
                        const novaQuantidadeTotal = produtoExistente.quantidadeTotal + novoProduto.quantidadeTotal;

                        // 2. Calcular o novo Custo Médio Ponderado
                        const valorTotalExistente = produtoExistente.quantidadeTotal * produtoExistente.custoMedio;
                        const valorTotalNovo = novoProduto.quantidadeTotal * novoProduto.custoMedio;
                        const novoCustoMedio = (valorTotalExistente + valorTotalNovo) / novaQuantidadeTotal;

                        // 3. Atualizar o item existente
                        estoqueAtualizado[indexExistente] = {
                            ...produtoExistente,
                            quantidadeTotal: novaQuantidadeTotal,
                            custoMedio: novoCustoMedio,
                            lotes: [...produtoExistente.lotes, loteNovo] // Adiciona o novo lote no array
                        };

                    } else {
                        // É UM PRODUTO NOVO: Apenas insere na lista
                        estoqueAtualizado.push(novoProduto);
                    }
                });

                // Dispara o salvamento em background
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

    // Função utilitária para limpar o estoque (útil para testes)
    const limparEstoque = useCallback(async () => {
        try {
            await AsyncStorage.removeItem(ESTOQUE_STORAGE_KEY);
            setProdutos([]);
        } catch (error) {
            console.error("Erro ao limpar estoque", error);
        }
    }, []);

    return {
        produtos,
        isLoading,
        fetchProdutos,
        adicionarProdutos,
        limparEstoque
    };
}