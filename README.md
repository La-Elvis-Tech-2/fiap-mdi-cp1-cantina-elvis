# Cantina FIAP

O **Cantina FIAP** é um app mobile (React Native + Expo) focado em **otimizar a experiência da cantina da FIAP**, trazendo uma navegação simples para **buscar produtos** e **montar um carrinho**.

## Funcionalidades implementadas
- Carrinho
- Busca de produtos

## Stack / Tecnologias
- **JavaScript**
- **React Native**
- **Expo**
- **expo-router** (navegação por arquivos)

## Integrantes do Grupo
- **rm554512** Murilo Justi
- **rm555137** Vitor Eskes
- **rm554972** Gustavo Morais
- **rm555460** Leonardo Rocha
- **rm554807** Leonardo Novaes

## Como rodar o projeto

### Pré-requisitos
- Node.js instalado
- Expo CLI (ou usar via `npx`)
- Expo Go no celular (opcional, para testar via QR Code)

### Passo a passo
1. Clone o repositório:
   ```bash
   git clone https://github.com/VitorEskes/cp-mobile.git
   cd cp-mobile
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Rode o app:
   ```bash
   npx expo start
   ```

## Estrutura do projeto (visão geral)

Principais arquivos/pastas:
- `app/` → **rotas e telas** (padrão do `expo-router`)
- `app/_layout.js` → **layout raiz** (Stack Navigator)
- `app/(tabs)/index.js` → tela principal do app (Home)
- `assets/` → imagens/recursos
- `App.js` → configuração do `Stack` (expo-router)
- `index.js` → registra o componente raiz do Expo

> Observação: a navegação é feita automaticamente pelo `expo-router` usando a estrutura de arquivos dentro de `app/`.

## Decisões Técnicas

### Como o projeto foi estruturado
- O projeto segue o padrão do **Expo + expo-router**, onde cada arquivo dentro da pasta `app/` representa uma rota/tela.
- A tela inicial está em `app/(tabs)/index.js` (grupo de rotas chamado `(tabs)`).
- O layout global da navegação fica em `app/_layout.js`, usando `Stack` para controlar as telas.

### Hooks utilizados e para quê
Nas telas foi utilizado principalmente:
- **`useState`**
  - Controlar estado de UI, por exemplo:
    - andar selecionado (ex.: 5º / 7º andar)
    - texto da busca
    - adição de produtos
    - categoria/preço selecionados nos filtros

### Demonstrações
<img width="180" height="861" alt="image" src="https://github.com/user-attachments/assets/7f2b0416-2e11-4184-b4f5-2053db33c2de" />
<img width="180" height="860" alt="image" src="https://github.com/user-attachments/assets/7314d2b4-45c2-4e66-9e56-14b58a73f674" />
<img width="180" height="861" alt="image" src="https://github.com/user-attachments/assets/39ab3673-69a1-4ce2-a604-3c5e263e370f" />

Link do vídeo
``` 
https://drive.google.com/file/d/1ZV21PdYRzNtT873EztZULRHIL_Edf_PY/view?usp=sharing
```

### Como a navegação foi organizada
- **`Stack` no layout raiz** (`app/_layout.js` / `App.js`):
  - Define a pilha de telas e configurações globais.
  - Atualmente, o header está desativado (`headerShown: false`).
- **Rotas por pasta/arquivo** (`app/`):
  - O `expo-router` cria as rotas automaticamente com base nos arquivos.
  - O grupo `(tabs)` é usado para organizar rotas (mesmo que nem todas as abas estejam configuradas como Tab Navigator ainda).

## Próximos passos (sugestões)
- Persistir carrinho (AsyncStorage ou backend)
- Integrar API real de produtos
- Melhorar o fluxo de navegação para tela de detalhes do produto e checkout
- Implementar Tabs de verdade (Home, Carrinho, Perfil, etc.) se desejado

---
Projeto acadêmico - FIAP.
