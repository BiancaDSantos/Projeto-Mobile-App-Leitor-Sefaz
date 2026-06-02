import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{

        tabBarActiveTintColor: '#B848ED',
        tabBarInactiveTintColor: '#8E8E93',

        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },

        headerShown: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Leitura',
          tabBarLabel: 'Início',
          tabBarIcon: ({ color, size }) => (
            <Feather name="camera" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="estoque"
        options={{
          title: 'Meu Estoque',
          tabBarLabel: 'Estoque',
          tabBarIcon: ({ color, size }) => (
            <Feather name="box" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}