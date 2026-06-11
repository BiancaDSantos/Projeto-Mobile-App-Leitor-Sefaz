import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CaptchaWebView } from '../components/CaptchaWebView';
import { MOCK_HTML_SEFAZ } from '@/mocks/mockSefaz';

export default function ConsultaScreen() {

    const { chave } = useLocalSearchParams<{ chave: string }>();
    const router = useRouter();

    if (!chave) {
        Alert.alert('Erro', 'Chave de acesso não fornecida.');
        router.back();
        return null;
    }

    const MODO_DESENVOLVIMENTO_OFFLINE = true;

    const baseUrl = process.env.EXPO_PUBLIC_URL_SEFAZ_SC;


    if (!baseUrl) {
        console.warn('Atenção: EXPO_PUBLIC_URL_SEFAZ_SC não está definida no .env');
    }

    const urlConsulta = `${baseUrl}?p=${chave}|2|1|1|`;

    const handleDataExtracted = (dados: any) => {

        if (!dados || !dados.produtos) {
            handleError('O formato da nota fiscal é inválido ou não possui itens.');
            return;
        }

        Alert.alert('Sucesso!', `${dados.produtos.length} itens encontrados na nota.`);


        router.replace({
            pathname: '/review',
            params: {
                produtos: JSON.stringify(dados.produtos),
                emitente: JSON.stringify(dados.emitente)
            }
        });
    };

    const handleError = (erro: string) => {
        Alert.alert(
            'Falha na Extração',
            erro || 'Não foi possível ler os dados desta nota fiscal.',
            [{ text: 'Voltar', onPress: () => router.back() }]
        );
    };

    return (
        // <View style={styles.container}>
        //     <CaptchaWebView
        //         url={urlConsulta}
        //         onDataExtracted={handleDataExtracted}
        //         onError={handleError}
        //     />
        // </View>

        <View style={styles.container}>
            <CaptchaWebView
                url={urlConsulta}
                htmlMock={MODO_DESENVOLVIMENTO_OFFLINE ? MOCK_HTML_SEFAZ : undefined} // Injeta o Mock aqui
                onDataExtracted={handleDataExtracted}
                onError={handleError}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F7',
    },
});