import React, { useEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Alert,
    TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { EmitenteSefaz, formatarMoeda, ProdutoEstoque, ProdutoSefaz } from '../types/estoque.type';
import { useEstoque } from '@/hooks/useEstoque';


export default function ReviewScreen() {

    const router = useRouter();
    const params = useLocalSearchParams<{ produtos: string; emitente: string }>();
  
    
    const [itensNota, setItensNota] = useState<ProdutoSefaz[]>(() => {
        try {
            return params.produtos ? JSON.parse(params.produtos as string) : [];
        } catch {
            return [];
        }
    });

    const handleAtualizarNome = (index: number, novoNome: string) => {
        const novaLista = [...itensNota];
        novaLista[index].nome = novoNome;
        setItensNota(novaLista);
    };

    const { adicionarProdutos } = useEstoque();

    const emitente: EmitenteSefaz | null = useMemo(() => {
        try {
            return params.emitente ? JSON.parse(params.emitente) : null;
        } catch {
            return null;
        }
    }, [params.emitente]);

    const totais = useMemo(() => {
        const totalItens = itensNota.reduce((acc, p) => acc + p.quantidade, 0);
        const valorBruto = itensNota.reduce((acc, p) => acc + (p.quantidade * p.valorUnitario), 0);
        return { totalItens, valorBruto };
    }, [itensNota]);

    const handleSalvarEstoque = async () => {
        try {
            const novosProdutosNoEstoque: ProdutoEstoque[] = itensNota.map(produto => {

                const idUnicoLote = Math.random().toString(36).substring(7);
                const dataHoje = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

                return {
                    id: produto.codigoSefaz || Math.random().toString(36).substring(7),
                    codigoSefaz: produto.codigoSefaz,
                    nome: produto.nome,
                    quantidadeTotal: produto.quantidade,
                    custoMedio: produto.valorUnitario,
                    unidadeMedida: 'UN',
                    lotes: [{
                        id: idUnicoLote,
                        dataEntrada: dataHoje,
                        quantidade: produto.quantidade,
                        valorUnitario: produto.valorUnitario
                    }]
                };

            });

            await adicionarProdutos(novosProdutosNoEstoque);

            Alert.alert(
                'Sucesso!',
                'Os produtos foram integrados ao seu estoque com sucesso.',
                [{ text: 'OK', onPress: () => router.push('/estoque') }]
            );

        } catch (error) {

            Alert.alert('Erro', 'Não foi possível salvar os itens no estoque.');

        }
    };

    const renderItem = ({ item, index }: { item: ProdutoSefaz; index: number }) => (

        <View style={styles.itemCard}>
            <View style={styles.itemHeader}>
                <TextInput
                    style={styles.itemNomeInput}
                    value={item.nome}
                    onChangeText={(text) => handleAtualizarNome(index, text)}
                    multiline
                />
                <Text style={styles.itemCodigo}>Cód: {item.codigoSefaz || 'N/A'}</Text>
            </View>

            <View style={styles.itemDetails}>
                <View style={styles.detailGroup}>
                    <Text style={styles.detailLabel}>Qtd</Text>
                    <Text style={styles.detailValue}>{item.quantidade} un</Text>
                </View>

                <View style={styles.detailGroup}>
                    <Text style={styles.detailLabel}>Vl. Unitário</Text>
                    <Text style={styles.detailValue}>R$ {formatarMoeda(item.valorUnitario)}</Text>
                </View>

                <View style={styles.detailGroupEnd}>
                    <Text style={styles.detailLabel}>Subtotal</Text>
                    <Text style={styles.subtotalValue}>
                        R$ {formatarMoeda(item.quantidade * item.valorUnitario)}
                    </Text>
                </View>
            </View>
        </View>

    );

    return (
        <SafeAreaView style={styles.container}>
            
            <View style={styles.header}>
                <View style={styles.headerTitleRow}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Feather name="arrow-left" size={24} color="#1C1C1E" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Revisar Itens</Text>
                </View>

                {emitente && (
                    <View style={styles.emitenteCard}>
                        <Feather name="shopping-bag" size={18} color="#B848ED" style={styles.emitenteIcon} />
                        <View style={styles.emitenteInfo}>
                            <Text style={styles.emitenteNome} numberOfLines={1}>{emitente.nome}</Text>
                            <Text style={styles.emitenteCnpj}>CNPJ: {emitente.cnpj}</Text>
                        </View>
                    </View>
                )}
            </View>

            
            <FlatList
                data={itensNota}
                keyExtractor={(item, index) => `item-${index}-${item.codigoSefaz}`}
                renderItem={({ item, index }) => renderItem({ item, index })}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />

           
            <View style={styles.footer}>
                <View style={styles.resumoRow}>
                    <Text style={styles.resumoText}>{totais.totalItens} itens na nota</Text>
                    <View style={styles.totalGroup}>
                        <Text style={styles.totalLabel}>Total Bruto:</Text>
                        <Text style={styles.totalValue}>R$ {formatarMoeda(totais.valorBruto)}</Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={handleSalvarEstoque}
                    activeOpacity={0.8}
                >
                    <Feather name="check-square" size={20} color="#FFF" />
                    <Text style={styles.confirmButtonText}>Confirmar e Salvar no Estoque</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    itemNomeInput: {
        fontSize: 15,
        fontWeight: '600',
        color: '#B848ED',
        marginBottom: 4,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5EA',
        paddingBottom: 4,
    },
    container: {
        flex: 1,
        backgroundColor: '#F2F2F7',
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 12,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5EA',
    },
    headerTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    backButton: {
        marginRight: 12,
        padding: 4,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1C1C1E',
    },
    emitenteCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F2F2F7',
        padding: 12,
        borderRadius: 12,
    },
    emitenteIcon: {
        marginRight: 10,
    },
    emitenteInfo: {
        flex: 1,
    },
    emitenteNome: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1C1C1E',
    },
    emitenteCnpj: {
        fontSize: 12,
        color: '#8E8E93',
        marginTop: 2,
    },
    listContainer: {
        padding: 24,
        gap: 12,
    },
    itemCard: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    itemHeader: {
        marginBottom: 12,
    },
    itemNome: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1C1C1E',
        lineHeight: 20,
    },
    itemCodigo: {
        fontSize: 12,
        color: '#8E8E93',
        marginTop: 4,
    },
    itemDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#F2F2F7',
        paddingTop: 12,
    },
    detailGroup: {
        alignItems: 'flex-start',
    },
    detailGroupEnd: {
        alignItems: 'flex-end',
    },
    detailLabel: {
        fontSize: 11,
        color: '#8E8E93',
        marginBottom: 2,
    },
    detailValue: {
        fontSize: 13,
        fontWeight: '500',
        color: '#3A3A3C',
    },
    subtotalValue: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1C1C1E',
    },
    footer: {
        backgroundColor: '#FFF',
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 24,
        borderTopWidth: 1,
        borderTopColor: '#E5E5EA',
    },
    resumoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    resumoText: {
        fontSize: 14,
        color: '#8E8E93',
    },
    totalGroup: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    totalLabel: {
        fontSize: 14,
        color: '#1C1C1E',
        marginRight: 4,
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#34C759',
    },
    confirmButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#34C759',
        paddingVertical: 16,
        borderRadius: 14,
        gap: 8,
    },
    confirmButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
});