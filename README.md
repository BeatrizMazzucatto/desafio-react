# Desafio React — Didact

![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow) ![HTML](https://img.shields.io/badge/HTML5-orange) ![Babel](https://img.shields.io/badge/Babel-Standalone-blue)

Implementação simplificada do React do zero — construindo a biblioteca **Didact**

[Sobre](#-sobre-o-projeto) • [Missões](#-missões) • [Tecnologias](#-tecnologias) • [Como Rodar](#-como-rodar) • [Estrutura](#-estrutura-do-projeto) • [Autores](#-autores)

---

## 📋 Sobre o Projeto

O **Didact** é uma implementação didática do React construída do zero em JavaScript puro, baseada no artigo original *"Build your own React"* de Rodrigo Pombo. O objetivo é compreender os princípios internos do React — Virtual DOM, Fiber Tree, Reconciliação, Hooks — sem as otimizações de produção, mas com os mesmos fundamentos arquiteturais.

## 🎯 Objetivo

Entender como o React funciona internamente através da construção de uma versão simplificada, com suporte a:

- ⚛️ Criação de elementos via `createElement`
- 🌳 Árvore de Fibras com travessia iterativa
- 🔄 Reconciliação e algoritmo de diff
- ⚡ Modo concorrente com `requestIdleCallback`
- 🪝 Hook `useState` com fila de ações (batching)
- 🖥️ Componentes funcionais com JSX via Babel

---

## 🚀 Missões

### Missão 1 — `createElement` e `render`

Implementação da criação de elementos virtuais e renderização recursiva no DOM.

- ✅ `createElement` — transforma JSX em objetos de elemento
- ✅ `createTextElement` — normaliza nós de texto
- ✅ `render` — renderização recursiva (abordagem ingênua)

### Missão 2 — Modo Concorrente e Árvore de Fibras

Quebra do trabalho em unidades para não bloquear a thread principal.

- ✅ `workLoop` com `requestIdleCallback`
- ✅ `performUnitOfWork` — travessia *left-child right-sibling*
- ✅ Estrutura de fibras com `child`, `sibling` e `parent`

### Missão 3 — Fases de Render/Commit e Reconciliação

Separação entre cálculo e mutação do DOM, com algoritmo de diff.

- ✅ `updateDom` — sincronização de props e event listeners
- ✅ `render` — nova versão com `wipRoot` (work-in-progress)
- ✅ `commitRoot` / `commitWork` — fase de commit atômica
- ✅ `reconcileChildren` — diff com `PLACEMENT`, `UPDATE` e `DELETION`

### Missão 4 — Componentes Funcionais e `useState`

Suporte a componentes funcionais e estado local via hooks.

- ✅ `updateFunctionComponent` — executa a função do componente
- ✅ `useState` — estado persistente com fila de ações (batching)
- ✅ Cursores globais `wipFiber` e `hookIndex`

### Missão 5 — Integração Final com JSX

Integração de todas as peças com transpilação JSX via Babel Standalone.

- ✅ Pragma `/** @jsx Didact.createElement */`
- ✅ Componente `Counter` com incremento e decremento
- ✅ Verificação de reaproveitamento de nós DOM via DevTools

---

## ✨ Funcionalidades

| Funcionalidade | Descrição |
|---|---|
| **Virtual DOM** | Representação da UI como árvore de objetos em memória |
| **Fiber Tree** | Estrutura *left-child right-sibling* para travessia iterativa |
| **Scheduler** | Controle de quando o trabalho acontece via `requestIdleCallback` |
| **Reconciliação** | Diff entre árvore atual e nova para minimizar operações no DOM |
| **Commit Phase** | Aplicação atômica das mutações sem interrupção do navegador |
| **useState** | Hook de estado com suporte a batching de ações |
| **JSX** | Transpilação em tempo real via Babel Standalone |

---

## 🛠 Tecnologias

| Categoria | Tecnologia |
|---|---|
| Linguagem | JavaScript ES6+ |
| Transpilador | Babel Standalone (CDN) |
| Markup | HTML5 |
| Versionamento | Git / GitHub |
| Servidor local | Live Server / `npx serve` / Python HTTP |

---

## 📦 Pré-requisitos

```bash
# Qualquer uma das opções abaixo serve como servidor local

npx serve .

# ou
python3 -m http.server 8080

# ou instale a extensão Live Server no VS Code
```

> ⚠️ **Importante:** abrir o `index.html` diretamente pelo sistema de arquivos (`file://`) causa erro de CORS silencioso — o Babel não consegue buscar o `app.js`. Use sempre um servidor local.

---

## 💻 Como Rodar

### 1️⃣ Clone o repositório

```bash
git clone https://github.com/seu-usuario/desafio-react.git
cd desafio-react
```

### 2️⃣ Inicie um servidor local

```bash
npx serve .
```

### 3️⃣ Acesse no navegador

```
http://localhost:3000
```

### 🧪 O que verificar

| Comportamento | O que prova |
|---|---|
| Counter aparece na tela | Resolução de componente funcional + render inicial funcionando |
| Clicar em `+` incrementa | Fila do `useState` + ciclo de re-render funcionando |
| Clicar em `-` decrementa | Mesmo mecanismo, direção contrária |
| `<div>` não pisca no DevTools | Reconciliador reaproveitando o nó DOM via `UPDATE` |

---

## 📁 Estrutura do Projeto

```
desafio-react/
├── 📄 index.html       # Página principal com Babel Standalone
├── 📄 didact.js        # Biblioteca Didact completa (Missões 1–5)
├── 📄 app.js           # Componente Counter em JSX
└── 📖 README.md        # Este arquivo
```

### Branches

```
main
├── missao-1    # createElement e render
├── missao-2    # Fiber Tree e Work Loop
├── missao-3    # Reconciliação e Commit Phase
├── missao-4    # Componentes funcionais e useState
└── missao-5    # Integração final com JSX
```

---

## 🤝 Contribuindo

1. 🍴 Fork o projeto
2. 🌿 Crie uma branch (`git checkout -b feature/NovaFuncionalidade`)
3. 💾 Commit suas mudanças (`git commit -m 'feat: adiciona nova funcionalidade'`)
4. 📤 Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. 🔃 Abra um Pull Request

---

## 👥 Autores

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/BeatrizMazzucatto">
        <img src="https://github.com/BeatrizMazzucatto.png" width="100px;" alt="Beatriz Mazzucatto"/><br>
        <sub><b>Beatriz Mazzucatto</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/juliagarciac">
        <img src="https://github.com/juliagarciac.png" width="100px;" alt="Julia Garcia"/><br>
        <sub><b>Julia Garcia</b></sub>
      </a>
    </td>
  </tr>
</table>

---

## 🙏 Agradecimentos

- 💚 Rodrigo Pombo pelo artigo original *"Build your own React"*
- 📚 Giovani Disperati pelo material da disciplina
- 🌟 Comunidade open source

---

*Última atualização: Abril 2026*
