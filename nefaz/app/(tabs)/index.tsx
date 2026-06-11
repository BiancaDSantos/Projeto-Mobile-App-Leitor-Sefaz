import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { chaveNFeSchema } from '../../schemas/leituraSchema'; 

const formSchema = z.object({
  chave: chaveNFeSchema,
});

type FormData = z.infer<typeof formSchema>;

export default function HomeIndex() {
  const router = useRouter();
  
  const [isSubmittingManual, setIsSubmittingManual] = useState(false);
  
  const { 
    control, 
    handleSubmit, 
    watch,
    formState: { errors } 
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      chave: '',
    },
    mode: 'onChange',
  });

  const chaveValue = watch('chave');
  const lengthNumeros = chaveValue ? chaveValue.replace(/\D/g, '').length : 0;

  const onSubmit = async (data: FormData) => {
    setIsSubmittingManual(true);
    Keyboard.dismiss();
    
    try {
      // Limpa a formatação e extrai apenas os números antes de enviar
      const chaveLimpa = data.chave.replace(/\D/g, '');
      
      // Navega para a tela de Consulta (WebView) passando a chave de acesso
      router.push({ pathname: '/consulta', params: { chave: chaveLimpa } });
      
    } catch (error: any) {
      Alert.alert('Erro', 'Ocorreu um problema ao iniciar a consulta.');
    } finally {
      setIsSubmittingManual(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          
          <View style={styles.header}>
            <Text style={styles.title}>Nova Leitura</Text>
            <Text style={styles.subtitle}>
              Escolha como deseja importar os produtos para o seu estoque.
            </Text>
          </View>

          {/* OPÇÃO 1: Scanner via Câmera */}
          <View style={styles.section}>
            <TouchableOpacity 
              style={styles.primaryButton}
              activeOpacity={0.8}
              onPress={() => router.push('/scanner')}
              //onPress={() => Alert.alert('Botão funcionou', 'O clique está passando!')}
              disabled={isSubmittingManual}
            >
              <Feather name="maximize" size={24} color="#FFF" />
              <Text style={styles.primaryButtonText}>Ler QR Code com a Câmera</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OU</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* OPÇÃO 2: Formulário Manual */}
          <View style={styles.section}>
            <Text style={styles.label}>Digite a Chave de Acesso (44 números)</Text>
            
            <Controller
              control={control}
              name="chave"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={[
                  styles.inputContainer, 
                  errors.chave && styles.inputError
                ]}>
                  <Feather 
                    name="key" 
                    size={20} 
                    color={errors.chave ? '#FF3B30' : '#8E8E93'} 
                    style={styles.inputIcon} 
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Ex: 4223 0100 0000..."
                    placeholderTextColor="#C7C7CC"
                    keyboardType="numeric"
                    maxLength={44}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    editable={!isSubmittingManual}
                  />
                </View>
              )}
            />
            
            {errors.chave && (
              <Text style={styles.errorText}>
                {errors.chave.message}
              </Text>
            )}
            
            <TouchableOpacity 
              style={[
                styles.secondaryButton, 
                (lengthNumeros < 44 || isSubmittingManual) && styles.buttonDisabled 
              ]}
              activeOpacity={0.8}
              onPress={handleSubmit(onSubmit)}
              disabled={lengthNumeros < 44 || isSubmittingManual}
            >
              {isSubmittingManual ? (
                <ActivityIndicator size="small" color="#8E8E93" />
              ) : (
                <>
                  <Text style={[
                    styles.secondaryButtonText, 
                    lengthNumeros < 44 && styles.buttonTextDisabled
                  ]}>
                    Buscar Nota Manualmente
                  </Text>
                  <Feather 
                    name="arrow-right" 
                    size={20} 
                    color={lengthNumeros < 44 ? '#8E8E93' : '#007AFF'} 
                  />
                </>
              )}
            </TouchableOpacity>
          </View>

        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7', padding: 24, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1C1C1E', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#8E8E93', textAlign: 'center', lineHeight: 24 },
  section: { width: '100%' },
  
  // Botão Principal (Câmera)
  primaryButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#007AFF', paddingVertical: 18, borderRadius: 16, gap: 12, elevation: 3, shadowColor: '#007AFF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6 },
  primaryButtonText: { color: '#FFF', fontSize: 18, fontWeight: '600' },
  
  // Divisor
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 32 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#D1D1D6' },
  dividerText: { marginHorizontal: 16, fontSize: 14, fontWeight: '600', color: '#8E8E93' },
  
  // Formulário Manual
  label: { fontSize: 14, fontWeight: '500', color: '#3A3A3C', marginBottom: 8, marginLeft: 4 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#D1D1D6', paddingHorizontal: 16, height: 56, marginBottom: 4 },
  inputError: { borderColor: '#FF3B30' },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: '#1C1C1E', height: '100%' },
  errorText: { color: '#FF3B30', fontSize: 12, marginLeft: 4, marginBottom: 16 },

  // Botão Secundário (Manual)
  secondaryButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#E5F1FF', paddingVertical: 16, borderRadius: 12, gap: 8, minHeight: 56 },
  secondaryButtonText: { color: '#007AFF', fontSize: 16, fontWeight: '600' },
  buttonDisabled: { backgroundColor: '#E5E5EA', elevation: 0, shadowOpacity: 0 },
  buttonTextDisabled: { color: '#8E8E93' },
});