import React, { useRef, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { SEFAZ_EXTRACTOR_SCRIPT } from '../utils/injectScripts';

interface CaptchaWebViewProps {
    url: string;
    htmlMock?: string;
    onDataExtracted: (dados: any) => void;
    onError: (erro: string) => void;
}

export function CaptchaWebView({ url, htmlMock, onDataExtracted, onError }: CaptchaWebViewProps) {
    const webviewRef = useRef<WebView>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [status, setStatus] = useState<'LOADING' | 'CAPTCHA_VISIBLE' | 'PROCESSING'>('LOADING');

    const handleMessage = (event: WebViewMessageEvent) => {
        try {
            const parsedData = JSON.parse(event.nativeEvent.data);

            switch (parsedData.type) {
                case 'SEFAZ_CAPTCHA_REQUIRED':
                    // Oculta o loading e exibe a página para o usuário resolver o Captcha
                    setStatus('CAPTCHA_VISIBLE');
                    break;

                case 'SEFAZ_CAPTCHA_SOLVED':
                    // O usuário resolveu, bloqueia a tela enquanto a SEFAZ processa o clique
                    setStatus('PROCESSING');
                    break;

                case 'SEFAZ_SUCCESS':
                    onDataExtracted(parsedData.data);
                    break;

                case 'SEFAZ_ERROR':
                    onError(parsedData.message);
                    break;
            }
        } catch (e) {
            console.error('Erro no parser da mensagem:', e);
        }
    };

    const sourceParams = htmlMock
        ? { html: htmlMock, baseUrl: 'https://sat.sef.sc.gov.br' }
        : { uri: url };


    return (
        <View style={styles.container}>
            {/* Overlay de Loading inicial ou de processamento final */}
            {(status === 'LOADING' || status === 'PROCESSING') && (
                <View style={styles.overlayContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                    <Text style={styles.loadingText}>
                        {status === 'LOADING' ? 'Conectando à SEFAZ...' : 'Extraindo dados da nota...'}
                    </Text>
                </View>
            )}

            {/* <WebView
                ref={webviewRef}
                source={{ uri: url }}
                injectedJavaScript={SEFAZ_EXTRACTOR_SCRIPT}
                // Quando a página recarrega (PostBack), o script precisa ser injetado novamente
                injectedJavaScriptForMainFrameOnly={true}
                onMessage={handleMessage}
                // Se a página carregar e não disparar nenhuma mensagem, podemos usar isto de fallback
                onLoadEnd={() => {
                    if (status === 'LOADING') setStatus('CAPTCHA_VISIBLE');
                }}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                style={[styles.webview, status === 'CAPTCHA_VISIBLE' ? styles.webviewVisible : styles.webviewHidden]}
            /> */}


            <WebView
                ref={webviewRef}
                source={sourceParams} // Usa a string HTML local se existir
                injectedJavaScript={SEFAZ_EXTRACTOR_SCRIPT}
                injectedJavaScriptForMainFrameOnly={true}
                onMessage={handleMessage}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                // Se usar mock, pule a exibição visual e dispare a leitura direto
                style={[styles.webview, (status === 'CAPTCHA_VISIBLE' || htmlMock) ? styles.webviewVisible : styles.webviewHidden]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F7',
        borderRadius: 16,
        overflow: 'hidden',
    },
    webview: {
        flex: 1,
        backgroundColor: 'transparent',
    },

    webviewVisible: {
        opacity: 1,
    },
    webviewHidden: {
        opacity: 0.01,
    },
    overlayContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        zIndex: 10,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        fontWeight: '500',
        color: '#3A3A3C',
    }
});