import { Slot } from 'expo-router';
import { EstoqueProvider } from '@/hooks/useEstoque';

export default function RootLayout() {
  return (
    <EstoqueProvider>
      <Slot />
    </EstoqueProvider>
  );
}
