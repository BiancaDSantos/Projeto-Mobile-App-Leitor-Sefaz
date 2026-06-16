import React, { useRef, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { gerarScriptSefaz } from '../utils/injectScripts';
import { DadosExtracaoSefaz } from '@/types/estoque.type';

interface CaptchaWebViewProps {
    url: string;
    chaveAcesso: string;
    onDataExtracted: (dados: DadosExtracaoSefaz) => void;
    onError: (erro: string) => void;
}

export function CaptchaWebView({ url, chaveAcesso, onDataExtracted, onError }: CaptchaWebViewProps) {
    const webviewRef = useRef<WebView>(null);
    const [status, setStatus] = useState<'LOADING' | 'CAPTCHA_VISIBLE' | 'PROCESSING'>('LOADING');
    const [loadingMessage, setLoadingMessage] = useState('Conectando à SEFAZ...');

    const [reloadCount, setReloadCount] = useState(0);
    
    const handleMessage = (event: WebViewMessageEvent) => {
        try {
            const parsedData = JSON.parse(event.nativeEvent.data);

            switch (parsedData.type) {
                case 'SEFAZ_FILLING_FORM':
                    setLoadingMessage('Inserindo chave de acesso...');
                    break;
                case 'SEFAZ_CAPTCHA_REQUIRED':
                    setStatus('CAPTCHA_VISIBLE');
                    break;
                case 'SEFAZ_CAPTCHA_SOLVED':
                    setStatus('PROCESSING');
                    setLoadingMessage('Resolvendo segurança...');
                    break;
                case 'SEFAZ_PROCESSING_DATA':
                    setStatus('PROCESSING');
                    setLoadingMessage('Extraindo dados da nota...');
                    break;
                case 'SEFAZ_SUCCESS':
                    onDataExtracted(parsedData.data);
                    break;
                case 'SEFAZ_BLOCKED':
                    onError(parsedData.message);
                    break;
                case 'SEFAZ_ERROR':
                    onError(parsedData.message);
                    break;
                case 'SEFAZ_RELOAD_REQUIRED':
                    if (reloadCount < 3) {
                        setReloadCount(prev => prev + 1);
                        setStatus('LOADING');
                        setLoadingMessage(`Reiniciando verificação (${reloadCount + 1}/3)...`);
                        webviewRef.current?.reload();
                    } else {
                        
                        onError('Não foi possível validar a segurança após várias tentativas. O portal pode estar instável.');
                    }
                    break;
                
            }
        } catch (e) {
            console.error('Erro no parser da mensagem:', e);
        }
    };

    return (
        <View style={styles.container}>
            {(status === 'LOADING' || status === 'PROCESSING') && (
                <View style={styles.overlayContainer}>
                    <ActivityIndicator size="large" color="#B848ED" />
                    <Text style={styles.loadingText}>{loadingMessage}</Text>
                </View>
            )}

            <WebView
                ref={webviewRef}
                source={{uri : url}}
                injectedJavaScript={gerarScriptSefaz(chaveAcesso)}
                onMessage={handleMessage}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                style={[styles.webview, (status === 'CAPTCHA_VISIBLE') ? styles.webviewVisible : styles.webviewHidden]}
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