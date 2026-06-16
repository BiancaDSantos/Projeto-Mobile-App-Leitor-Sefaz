import { useState, useEffect, useCallback } from 'react';
import { Vibration, Alert } from 'react-native';
import { useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';

export function useCameraLeitorQRCode() {

    const router = useRouter();
    const [permissao, solicitarPermissao] = useCameraPermissions();
    const [escaneado, setEscaneado] = useState(false);

    useEffect(() => {

        if (!permissao) return;
        if (!permissao.granted && permissao.canAskAgain) {
            solicitarPermissao();
        }

    }, [permissao, solicitarPermissao]);

    const extrairChaveSefaz = useCallback((dadosIniciais: string): string | null => {

        const regexMatch = dadosIniciais.match(/\d{44}/);
        return regexMatch ? regexMatch[0] : null;

    }, []);

    const lidarComLeitura = useCallback(({ data }: { data: string }) => {

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

    }, [escaneado, extrairChaveSefaz, router]);

    const resetarScanner = useCallback(() => {
        setEscaneado(false);
    }, []);

    return {
        permissao,
        escaneado,
        solicitarPermissao,
        lidarComLeitura,
        resetarScanner
    };
}