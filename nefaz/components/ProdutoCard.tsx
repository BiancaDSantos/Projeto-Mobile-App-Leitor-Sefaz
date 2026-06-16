import React, { useState } from 'react';
import { View, Text, StyleSheet, LayoutAnimation, TouchableOpacity } from 'react-native';
import { ProdutoEstoque, formatarMoeda } from '@/types/estoque.type';
import { Feather } from '@expo/vector-icons';

interface ProductCardProps {
    produto: ProdutoEstoque;
    onDelete?: () => void;
}


export function ProductCard({ produto, onDelete }: ProductCardProps) {

    const [expandido, setExpandido] = useState(false);
    const temLotes = produto.lotes && produto.lotes.length > 0;

    const toggleExpand = () => {
        if (!temLotes) return;
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandido(!expandido);
    };

    return (
        <View style={styles.card}>
            <TouchableOpacity
                onPress={toggleExpand}
                activeOpacity={temLotes ? 0.7 : 1}
                disabled={!temLotes}
            >
                <View style={styles.cardHeader}>
                    <Text style={styles.produtoNome} numberOfLines={2}>
                        {produto.icone ? `${produto.icone} ` : ''}{produto.nome}
                    </Text>

                    <View style={styles.headerAcoes}>
                        {temLotes && (
                            <Text style={styles.indicadorExpandir}>
                                {expandido ? '[-]' : '[+]'}
                            </Text>
                        )}

                        {onDelete && (
                            <TouchableOpacity
                                onPress={onDelete}
                                style={styles.btnExcluir}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <Feather name="trash-2" size={18} color="#FF3B30" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                <View style={styles.cardBody}>
                    <View style={styles.infoGroup}>

                        <Text style={styles.label}>Qtd</Text>
                        <Text style={styles.value}>{produto.quantidadeTotal}</Text>

                    </View>

                    <View style={styles.infoGroup}>

                        <Text style={styles.label}>C. Médio</Text>
                        <Text style={styles.value}>R$ {formatarMoeda(produto.custoMedio)}</Text>

                    </View>

                    <View style={styles.infoGroupTotal}>

                        <Text style={styles.label}>Total</Text>

                        <Text style={styles.totalValue}>R$
                            {formatarMoeda(produto.custoMedio * produto.quantidadeTotal)}
                        </Text>

                    </View>
                </View>
            </TouchableOpacity>


            {expandido && temLotes && (
                <View style={styles.lotesContainer}>
                    <View style={styles.divisor} />
                    {produto.lotes.map((lote) => (
                        <View key={lote.id} style={styles.loteRow}>
                            <Text style={styles.loteTexto}>Entrada {lote.dataEntrada}:</Text>
                            <Text style={styles.loteValor}>
                                {lote.quantidade} un - R$ {formatarMoeda(lote.valorUnitario)}
                            </Text>
                        </View>
                    ))}
                </View>

            )}
        </View>
    );
}

const styles = StyleSheet.create({
    headerAcoes: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    btnExcluir: {
        marginLeft: 12,
        padding: 4,
    },
    card: {

        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,

    },
    cardHeader: {

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,

    },
    produtoNome: {

        fontSize: 16,
        fontWeight: '600',
        color: '#1C1C1E',
        flex: 1,

    },
    indicadorExpandir: {

        fontSize: 14,
        color: '#8E8E93',
        fontWeight: 'bold',
        marginLeft: 8,

    },
    cardBody: {

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#E5E5EA',
        paddingTop: 12,

    },
    infoGroup: {
        alignItems: 'flex-start',
    },
    infoGroupTotal: {
        alignItems: 'flex-end',
    },
    label: {
        fontSize: 12,
        color: '#8E8E93',
        marginBottom: 4,
    },
    value: {
        fontSize: 14,
        fontWeight: '500',
        color: '#3A3A3C',
    },
    totalValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#34C759',
    },
    divisor: {
        height: 1,
        backgroundColor: '#E5E5EA',
        marginTop: 16,
        marginBottom: 12,
    },
    lotesContainer: {
        marginTop: 4,
    },
    loteRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 6,
    },
    loteTexto: {
        fontSize: 14,
        color: '#8E8E93',
    },
    loteValor: {
        fontSize: 14,
        fontWeight: '500',
        color: '#3A3A3C',
    },
});