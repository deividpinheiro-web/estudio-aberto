# Estúdio Aberto — Som da Quebrada

Site do projeto cultural **Estúdio Aberto**: um estúdio móvel comunitário e gratuito que percorre bairros periféricos para gravar, mixar e distribuir artistas independentes de trap e rap nacional.

## Tecnologias escolhidas

| Escolha | Por quê |
|---|---|
| **JavaScript (ES2022)** | Linguagem padrão da web, roda em qualquer navegador e tem a maior comunidade de ajuda. |
| **React 18** | Componentes reutilizáveis (Player, Formulário, Cards) e estado reativo, o que deixa o player sincronizado com os cards sem manipular o DOM na mão. |
| **Vite 5** | Servidor de desenvolvimento instantâneo e build otimizado para publicação. |
| **GitHub + GitHub Actions + Pages** | Versionamento do código e publicação automática a cada push na `main`. |

## Como rodar

Requer [Node.js 18+](https://nodejs.org).

```bash
npm install
npm run dev      # abre em http://localhost:5173
npm run build    # gera a pasta dist/ para publicação
```

## Estrutura

```
src/
  App.jsx                  página, catálogo, roteiro, modal
  data.js                  artistas, faixas, letras e bios
  styles.css               identidade visual (dark mode + alto contraste)
  hooks/usePlayer.js       lógica do player de áudio
  hooks/usePersisted.js    estado salvo no localStorage
  components/Player.jsx    barra de player fixa
  components/SignupForm.jsx formulário com validação e protocolo
.github/workflows/deploy.yml  publicação no GitHub Pages
```

## Reaproveitamento e melhorias

A **versão 1** foi um protótipo em um único `index.html` (HTML + CSS + JS puro). Na **versão 2** o projeto foi reaproveitado e melhorado:

- Identidade visual, textos e dados dos artistas mantidos (`styles.css` e `data.js` vêm da v1).
- Código reorganizado em componentes React e hooks.
- **Novo:** busca por artista, faixa ou bairro.
- **Novo:** favoritos salvos no navegador (filtro "Só favoritos").
- **Novo:** preferências de acessibilidade (tamanho da fonte e alto contraste) lembradas entre visitas.
- **Novo:** avanço automático para a próxima faixa e mensagem de erro de áudio.
- **Novo:** publicação automática no GitHub Pages.

## Publicar no GitHub

```bash
git remote add origin https://github.com/SEU-USUARIO/estudio-aberto.git
git push -u origin main
```

Depois, no repositório: **Settings → Pages → Source: GitHub Actions**. O site fica em `https://SEU-USUARIO.github.io/estudio-aberto/`.

## Equipe

Preencha com os nomes do grupo.

> Protótipo de plataforma cultural. Faixas de áudio demonstrativas livres de direitos autorais.
