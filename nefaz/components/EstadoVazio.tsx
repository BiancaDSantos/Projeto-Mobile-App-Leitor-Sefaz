import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface EmptyStateProps {
  iconName: keyof typeof Feather.glyphMap;
  title: string;
  description: string;
}

export function EmptyState({ iconName, title, description }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Feather name={iconName} size={48} color="#C7C7CC" />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({

  container: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 64 },

  title: { 
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginTop: 16 },

  description: { 
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 32 },

});