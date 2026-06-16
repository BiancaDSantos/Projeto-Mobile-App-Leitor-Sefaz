import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { formatarMoeda } from '../types/estoque.type';

interface ProdutoHeaderProps {
    nome: string;
    quantidadeTotal: number;
    custoMedio: number;
    icone: string;
    expandido: boolean;
    onToggle: () => void;
}

export const ProdutoHeader = ({

    nome,
    quantidadeTotal,
    custoMedio,
    icone,
    expandido,
    onToggle

}: ProdutoHeaderProps) => {
    return (

        <TouchableOpacity
            style={styles.header}
            onPress={onToggle}
            activeOpacity={0.7}
        >
            <View style={styles.headerLeft}>

                <Text style={styles.icone}>{icone}</Text>

                <View>

                    <Text style={styles.nomeProduto}>{nome}</Text>

                    <Text style={styles.resumoEstoque}>
                        {quantidadeTotal} un em estoque • custo médio: R$ {formatarMoeda(custoMedio)}
                    </Text>

                </View>

            </View>

            <Text style={styles.indicadorExpandir}>
                {expandido ? '[-]' : '[+]'}
            </Text>

        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icone: {
        fontSize: 24,
        marginRight: 12,
        backgroundColor: '#F5F7FA',
        padding: 8,
        borderRadius: 20,
    },
    nomeProduto: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A3B5C',
        marginBottom: 4,
    },
    resumoEstoque: {
        fontSize: 13,
        color: '#718096',
    },
    indicadorExpandir: {
        fontSize: 14,
        color: '#718096',
        fontWeight: 'bold',
    },
});