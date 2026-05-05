import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Product } from '../types/Produto';

interface ProductCardProps {
  produto: Product;
}

export function ProductCard({ produto }: ProductCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.produtoNome} numberOfLines={2}>
        {produto.nome}
      </Text>
      
      <View style={styles.cardBody}>
        <View style={styles.infoGroup}>
          <Text style={styles.label}>Qtd</Text>
          <Text style={styles.value}>{produto.quantidade}</Text>
        </View>
        
        <View style={styles.infoGroup}>
          <Text style={styles.label}>V. Unit</Text>
          <Text style={styles.value}>R$ {produto.valorUnitario.toFixed(2).replace('.', ',')}</Text>
        </View>

        <View style={styles.infoGroupTotal}>
          <Text style={styles.label}>Total</Text>
          <Text style={styles.totalValue}>R$ {produto.valorTotal.toFixed(2).replace('.', ',')}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  subtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
  listContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 12,
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
  produtoNome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 12,
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 64,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 32,
  },
});