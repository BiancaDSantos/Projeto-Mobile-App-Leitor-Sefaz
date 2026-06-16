export const gerarScriptSefaz = (chaveAcesso: string) => `
  (function() {
    if (window.__SEFAZ_SCRIPT_INJECTED) return;
    window.__SEFAZ_SCRIPT_INJECTED = true;

    try {
      // ESTADO 0: Tela Inicial (Inserir Chave e Buscar)
      const inputChave = document.getElementById('Body_Main_Main_sepConsultaNFCe_txtChave');
      const btnBuscar = document.getElementById('Body_Main_Main_sepConsultaNFCe_btnBuscar');
      
      if (inputChave && btnBuscar) {
        
        if (inputChave.value !== '${chaveAcesso}') {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'SEFAZ_FILLING_FORM' }));
          
          inputChave.value = '${chaveAcesso}';
          
          
          setTimeout(() => {
            btnBuscar.click();
          }, 300);
        }
        return; 
      }

      // ESTADO 1: Tela de Validação (Captcha Cloudflare)
      const btnValidar = document.getElementById('Body_Main_ButtonValidar');
      
      if (btnValidar) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'SEFAZ_CAPTCHA_REQUIRED' }));

        const checkTurnstileInterval = setInterval(() => {
          const turnstileInput = document.querySelector('[name="cf-turnstile-response"]');
          if (turnstileInput && turnstileInput.value) {
            clearInterval(checkTurnstileInterval);
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'SEFAZ_CAPTCHA_SOLVED' }));
            btnValidar.click();
          }
        }, 500);

        return; 
      }

      // ESTADO 2: Tela de Resultados (Nota Fiscal carregada)
      if (document.getElementById('tabResult')) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'SEFAZ_PROCESSING_DATA' }));

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

        const emitenteNome = document.querySelector('.txtTopo')?.innerText.trim() || '';
        const emitenteCnpjElement = document.querySelectorAll('.text')[0];
        const emitenteCnpj = emitenteCnpjElement ? emitenteCnpjElement.innerText.replace(/\\D/g, '') : '';

        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'SEFAZ_SUCCESS',
          data: {
            produtos: produtos,
            emitente: { nome: emitenteNome, cnpj: emitenteCnpj }
          }
        }));
      }

    } catch (err) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ 
        type: 'SEFAZ_ERROR', 
        message: err.message 
      }));
    }
  })();
  true;
`;