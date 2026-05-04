# Projeto-Mobile-App-Leitor-Sefaz
App React Native que lê QR Code da nota fiscal com a câmera, consulta diretamente a SEFAZ, extrai produtos e permite edição para controle de estoque doméstico. Reduz desperdício e organiza compras.

# 📱 NFC-e Stock Manager

[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-1B1F1B?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**Gerencie seu estoque doméstico escaneando notas fiscais com a câmera do celular.**

> Escaneie o QR Code da NFC-e, consulte os produtos diretamente na SEFAZ, edite e organize suas compras. Sem backend próprio, tudo rodando no seu dispositivo.

---

## 🎯 Impacto Social

- ♻️ **Redução de desperdício** de alimentos e produtos
- 💰 **Economia doméstica** com controle financeiro
- 📦 **Organização de compras** evitando itens duplicados
- 🧾 **Transparência** no consumo pessoal

---

## ✨ Funcionalidades

| Funcionalidade | Descrição |
|----------------|-----------|
| 📸 **Leitura de QR Code** | Usa a câmera do celular (Expo Camera) para escanear NFC-e |
| 🔍 **Consulta à SEFAZ** | Busca produtos diretamente no sistema do governo |
| ✏️ **Edição manual** | Corrige nomes, quantidades e preços dos itens |
| 📦 **Estoque local** | Salva e soma produtos automaticamente no celular |
| 📊 **Consulta de estoque** | Visualiza tudo que você tem organizado |

---

## 🏗️ Arquitetura da Solução

```mermaid
flowchart LR
    A[Câmera] -->|QR Code| B[App RN]
    B -->|Requisição HTTPS| C[SEFAZ]
    C -->|HTML com produtos| B
    B -->|Edição| D[Usuário]
    D -->|Salvar| E[AsyncStorage]
    E -->|Consultar| F[Estoque Local]
