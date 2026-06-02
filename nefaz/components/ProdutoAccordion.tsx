import React, { useState } from 'react';
import { View, StyleSheet, LayoutAnimation } from 'react-native';
import { ProdutoHeader } from './ProdutoHeader';
import { LoteItem } from './LoteItem';

interface ProdutoProps {

    nome: string;
    quantidadeTotal: number;
    custoMedio: number;
    lotes: {
        id: string;
        dataEntrada: string;
        quantidade: number;
        valorUnitario: number;
    }[];
    icone: string;

}


export const ProdutoAccordion = ({

    nome,
    quantidadeTotal,
    custoMedio,
    lotes,
    icone

}: ProdutoProps) => {

    const [expandido, setExpandido] = useState(false);

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandido(!expandido);
    };

    return (
        <View style={styles.card}>
            <ProdutoHeader
                nome={nome}
                quantidadeTotal={quantidadeTotal}
                custoMedio={custoMedio}
                icone={icone}
                expandido={expandido}
                onToggle={toggleExpand}
            />

            {expandido && (
                <View style={styles.lotesContainer}>
                    <View style={styles.divisor} />

                    {lotes.map((lote) => (
                        <LoteItem key={lote.id} lote={lote} />
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    divisor: {
        height: 1,
        backgroundColor: '#EDF2F7',
        marginTop: 16,
        marginBottom: 12,
    },
    lotesContainer: {
        marginTop: 4,
    },
});