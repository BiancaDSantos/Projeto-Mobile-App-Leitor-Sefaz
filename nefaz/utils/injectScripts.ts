export const SEFAZ_EXTRACTOR_SCRIPT = `
  (function() {
    // Evita múltiplas execuções do mesmo script se a página demorar a estabilizar
    if (window.__SEFAZ_SCRIPT_INJECTED) return;
    window.__SEFAZ_SCRIPT_INJECTED = true;

    try {
      // ESTADO 1: Tela de Validação (Captcha)
      const btnValidar = document.getElementById('Body_Main_ButtonValidar');
      
      if (btnValidar) {
        // Informa ao React Native que o Captcha está na tela
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'SEFAZ_CAPTCHA_REQUIRED' }));

        // Cria um observador para auto-clicar no botão Validar 
        // assim que o Cloudflare preencher o token de resposta
        const checkTurnstileInterval = setInterval(() => {
          const turnstileInput = document.querySelector('[name="cf-turnstile-response"]');
          
          if (turnstileInput && turnstileInput.value) {
            clearInterval(checkTurnstileInterval);
            
            // Avisa o app que estamos prosseguindo
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'SEFAZ_CAPTCHA_SOLVED' }));
            
            // Dispara o clique nativo que aciona o __doPostBack do ASP.NET
            btnValidar.click();
          }
        }, 500);

        return; // Interrompe a execução aqui para aguardar a ação do usuário
      }

      // ESTADO 2: Tela de Resultados (Nota Fiscal carregada)
      if (document.getElementById('tabResult')) {
        const extractNumber = (str) => {
          if (!str) return 0;
          const limpo = str.replace(/[^\\d,]/g, '').replace(',', '.');
          return parseFloat(limpo) || 0;
        };

        const produtos = [];
        const rows = document.querySelectorAll('#tabResult tr');

        rows.forEach(row => {
          const nameEl = row.querySelector('.txtTit');
          const codEl = row.querySelector('.RCod');
          const qtdEl = row.querySelector('.Rqtd');
          const valUnitEl = row.querySelector('.RvlUnit');

          if (nameEl && qtdEl && valUnitEl) {
            produtos.push({
              nome: nameEl.innerText.trim(),
              codigoSefaz: codEl ? codEl.innerText.replace(/\\D/g, '') : '',
              quantidade: extractNumber(qtdEl.innerText),
              valorUnitario: extractNumber(valUnitEl.innerText)
            });
          }
        });

        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'SEFAZ_SUCCESS',
          data: produtos
        }));
      }

    } catch (err) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ 
        type: 'SEFAZ_ERROR', 
        message: err.message 
      }));
    }
  })();
  true; // Necessário para o injectedJavaScript
`;