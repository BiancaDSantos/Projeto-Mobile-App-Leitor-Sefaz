import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LoteEntrada } from '../types/estoque.type';
import { formatarMoeda } from '../types/estoque.type';

interface LoteItemProps {
    lote: LoteEntrada;
}

export const LoteItem = ({ lote }: LoteItemProps) => {
    return (

        <View style={styles.loteRow}>

            <Text style={styles.loteTexto}>Entrada {lote.dataEntrada}:</Text>

            <Text style={styles.loteValor}>
                {lote.quantidade} un - R$ {formatarMoeda(lote.valorUnitario)}
            </Text>

        </View>

    );
};

const styles = StyleSheet.create({

    loteRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 6,
    },

    loteTexto: {
        fontSize: 14,
        color: '#4A5568',
    },

    loteValor: {
        fontSize: 14,
        fontWeight: '500',
        color: '#2D3748',
    },

});