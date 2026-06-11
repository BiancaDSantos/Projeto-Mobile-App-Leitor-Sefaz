import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  Vibration
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

export default function ScannerScreen() {
  const router = useRouter();
  const [permissao, solicitarPermissao] = useCameraPermissions();
  const [escaneado, setEscaneado] = useState(false);

  
  useEffect(() => {
    if (!permissao) return;
    if (!permissao.granted && permissao.canAskAgain) {
      solicitarPermissao();
    }
  }, [permissao]);

  
  const extrairChaveSefaz = (dadosIniciais: string): string | null => {
    
    const regexMatch = dadosIniciais.match(/\d{44}/);
    return regexMatch ? regexMatch[0] : null;
    
  };

  const lidarComLeitura = ({ data }: { data: string }) => {
    if (escaneado) return;
    
    setEscaneado(true);
    const chaveExtraida = extrairChaveSefaz(data);

    if (chaveExtraida) {
      Vibration.vibrate(100);
      
      Alert.alert(
        'QR Code Lido!',
        `Chave de acesso detectada.\nDeseja iniciar a consulta?`,
        [
          { 
            text: 'Cancelar', 
            style: 'cancel', 
            onPress: () => setEscaneado(false)
          },
          { 
            text: 'Consultar', 
            onPress: () => {
              
              router.replace({ pathname: '/consulta', params: { chave: chaveExtraida } });

            } 
          }
        ]
      );
    } else {
      Vibration.vibrate([0, 100, 100, 100]);
      
      Alert.alert(
        'QR Code Inválido',
        'Não foi possível encontrar uma chave de acesso de 44 dígitos neste código.',
        [{ text: 'Tentar Novamente', onPress: () => setEscaneado(false) }]
      );
    }
  };

 
  if (!permissao) {
    return <View style={styles.containerFallback} />;
  }

  if (!permissao.granted) {
    return (
      <View style={styles.containerFallback}>
        <Feather name="camera-off" size={64} color="#8E8E93" />
        <Text style={styles.textoPermissao}>
          Precisamos do seu acesso à câmera para ler o QR Code da nota fiscal.
        </Text>
        <TouchableOpacity style={styles.botaoPermissao} onPress={solicitarPermissao}>
          <Text style={styles.textoBotaoPermissao}>Conceder Permissão</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botaoVoltarPermissao} onPress={() => router.back()}>
          <Text style={styles.textoBotaoVoltar}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={escaneado ? undefined : lidarComLeitura}
      />

      
      <View style={styles.overlay}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.botaoVoltar} onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.areaCentral}>
          <View style={styles.miraExterna}>
            <View style={styles.miraInterna} />
          </View>
          <Text style={styles.textoInstrucao}>
            Posicione o QR Code da nota fiscal dentro do quadrado
          </Text>
        </View>

        <View style={styles.footer} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  containerFallback: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'space-between',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    height: 120,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  botaoVoltar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  areaCentral: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // O 'transparent' cria o buraco no overlay para a câmera aparecer limpa
    backgroundColor: 'transparent',
  },
  miraExterna: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#34C759',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  miraInterna: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  textoInstrucao: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 32,
    paddingHorizontal: 40,
    fontWeight: '500',
  },
  footer: {
    height: 120,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  textoPermissao: {
    fontSize: 16,
    color: '#3A3A3C',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  botaoPermissao: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  textoBotaoPermissao: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  botaoVoltarPermissao: {
    marginTop: 16,
    paddingVertical: 16,
  },
  textoBotaoVoltar: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
});