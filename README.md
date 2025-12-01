# Gerenciador de Perfil Interativo (Scaffold) — adaptado para Calculadora de IMC

Este repositório contém um scaffold Expo adaptado para a atividade: "Calculadora de IMC" — implementação com Expo, React Navigation, TextInput controlado, cálculo de IMC, renderização condicional e histórico persistido com AsyncStorage.

## Estrutura

- `App.js` - entrada principal do app, configura navegação.
- `src/screens/CalculatorScreen.js` - tela principal da Calculadora de IMC.
- `src/screens/HistoryScreen.js` - tela com histórico de cálculos salvos.
- `src/screens/AboutScreen.js` - tela de informações/ajuda.

## Requisitos locais

- Node.js LTS (recomendo 18.x ou 20.x)
- Git (opcional)
- Expo CLI (opcional; usamos `npx` nos comandos abaixo)
- Para testar em dispositivo: Expo Go (Android/iOS)
- Para emulador Android: Android Studio + AVD

## Como rodar (Windows PowerShell)

1. Instalar dependências:

```powershell
cd c:/PROJETOS/oat-app
npm install
```

2. Iniciar o Metro bundler / Expo:

```powershell
npx expo start
```

3. Abrir no celular: escaneie o QR code com Expo Go; ou pressione "Run on Android device/emulator" no Metro.

## Funcionalidades implementadas

- Cálculo do IMC com entrada de peso (kg) e altura (m).
- TextInput controlados ligados ao estado do componente (classe).
- Renderização condicional: exibe resultado e recomendações somente após o cálculo.
- Histórico persistido com `AsyncStorage` e tela de visualização/remoção.
- Layout com `View` e `StyleSheet` usando Flexbox para responsividade.

## Observações

- Dependências nativas utilizadas seguem a compatibilidade com a versão do SDK Expo; se houver warnings ao instalar, siga as recomendações do Expo para alinhar versões.
- Para limpar o histórico, use a opção "Limpar histórico" na tela correspondente.

Se quiser, posso também:
- Gerar um PDF com o Artigo de Fundamentação (Entrega 1) a partir do markdown em `docs/`.
- Atualizar automaticamente as versões das dependências listadas como "recomendadas" pelo Expo.
