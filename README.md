# 🛒 Nefaz - Extrator e Gestor de Estoque via NFC-e

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

O **Nefaz** é um aplicativo mobile focado em automatizar a entrada de produtos no estoque de pequenos e médios negócios. Sem a necessidade de digitação manual ou APIs pagas, o app utiliza a câmera do celular para ler o QR Code de Notas Fiscais de Consumidor Eletrônica (NFC-e), extrai os dados diretamente do portal da SEFAZ utilizando um motor de Web Scraping invisível e integra os produtos ao estoque local do usuário.

---

## ✨ Principais Funcionalidades

- **Leitura de QR Code Inteligente:** Identifica e extrai automaticamente a chave de acesso de 44 dígitos, ignorando códigos inválidos de forma silenciosa.
- **Web Scraping Autônomo:** Navega pelo portal da SEFAZ em segundo plano, preenche formulários e resolve desafios de segurança (Cloudflare Turnstile) sem intervenção do usuário.
- **Extração de Dados Estruturados:** Captura nome do produto, código, quantidade, valor unitário e dados do emitente (CNPJ e Razão Social).
- **Revisão e Edição:** Interface fluida para alteração da nomenclatura dos produtos antes da entrada no sistema.
- **Gestão de Estoque Local:** Armazenamento offline (AsyncStorage) com inteligência para mesclar lotes de notas diferentes e calcular o **Custo Médio** dinamicamente.

---

## 🏗️ A Engenharia por Trás (Arquitetura)

O grande diferencial deste projeto é a sua resiliência na extração de dados governamentais que não possuem APIs públicas abertas. A arquitetura foi desenhada com **Dual-Layer Protection** e um **Padrão Observer**:

1. **A Camada de WebView (`CaptchaWebView.tsx`):** O aplicativo não realiza requisições HTTP tradicionais que seriam bloqueadas. Ele instancia um navegador embutido invisível que aceita cookies de terceiros e *Mixed Content*, simulando tráfego orgânico para contornar bloqueios complexos (Erro 600010 do Turnstile).
2. **A Máquina de Estados Injetada (`injectScripts.ts`):** Em vez de executar um script estático, o app injeta um "Robô Observador" que roda em um ciclo de repetição seguro (Observer Pattern). Ele mapeia o DOM a cada segundo e reage de acordo com o estado da tela:
   - Identifica bloqueios de IP (Rate Limiting) e redirecionamentos amigáveis da SEFAZ.
   - Preenche o formulário despachando eventos (`dispatchEvent`) para acionar os validadores ASP.NET antigos da SEFAZ.
   - Detecta travamentos da verificação humana e aciona um sistema de *Auto-Retry* para recarregar a página autonomamente.
3. **Ponte de Comunicação:** Os dados "crus" extraídos são empacotados em JSON e enviados para a Native Thread via `window.ReactNativeWebView.postMessage`, mantendo o isolamento perfeito entre o "Mundo Web" e o "Mundo Mobile".

---

## 💻 Tecnologias Utilizadas

- **Frontend Mobile:** React Native & Expo Router (Navegação baseada em arquivos)
- **Linguagem:** TypeScript (Tipagem estrita ponta-a-ponta)
- **Scraping & Automação:** `react-native-webview` (Injeção de JavaScript no DOM)
- **Leitura de Código:** `expo-camera`
- **Armazenamento:** `@react-native-async-storage/async-storage`
- **Design & Ícones:** StyleSheet nativo e `@expo/vector-icons`

---

## 📂 Estrutura do Projeto

O código foi refatorado para garantir a Separação de Responsabilidades (SoC) e eliminação de *Dead Code*:

```text
nefaz/
├── app/                  # Telas da aplicação (Expo Router)
│   ├── (tabs)/           # Navegação principal (Home, Estoque)
│   ├── consulta.tsx      # Orquestrador do Scraping
│   ├── review.tsx        # Tela de edição pré-estoque
│   └── scanner.tsx       # Tela da câmera
├── components/           # Componentes visuais reaproveitáveis (Cards, Accordions)
├── hooks/                # Lógicas de negócio isoladas (useEstoque, useCamera)
├── types/                # Interfaces e Contratos de Dados (estoque.type.ts)
└── utils/                # Funções utilitárias (injectScripts.ts)
