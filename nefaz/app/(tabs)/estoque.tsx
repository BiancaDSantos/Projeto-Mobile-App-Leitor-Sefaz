import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useFocusEffect } from 'expo-router';


import { useEstoque } from '../../hooks/useEstoque';
import { ProductCard } from '../../components/ProdutoCard';
import { EmptyState } from '../../components/EstadoVazio';

export default function Estoque() {
  const { produtos, isLoading, fetchProdutos } = useEstoque();

  useFocusEffect(
    React.useCallback(() => {
      fetchProdutos();
    }, [fetchProdutos])
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meus Produtos</Text>
        <Text style={styles.subtitle}>{produtos.length} itens registrados</Text>
      </View>

      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProductCard produto={item} />}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState 
            iconName="inbox" 
            title="Seu estoque está vazio." 
            description="Escaneie uma nota fiscal para adicionar produtos aqui." 
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({

  container: { 
    flex: 1, 
    backgroundColor: '#F2F2F7' 
},

  centerContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
},

  header: { 
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16
},

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1C1C1E' 
},

  subtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4
},

  listContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 12 
},
});