# Estúdio Aberto — Som da Quebrada

🌐 **Acesse o sistema online:** [https://jolly-coast-0ebb7f610.4.azurestaticapps.net/](https://jolly-coast-0ebb7f610.4.azurestaticapps.net/)

Sistema web do projeto cultural **Estúdio Aberto**: um estúdio móvel comunitário e gratuito que percorre bairros periféricos para gravar, mixar, masterizar e distribuir faixas de artistas independentes de trap e rap nacional.

A plataforma apresenta os pilares da iniciativa, um catálogo interativo com player de áudio contínuo, o cronograma itinerante do estúdio e o passo a passo de participação.

## Demanda real
Artistas independentes das periferias enfrentam barreiras financeiras e técnicas para acessar estúdios profissionais e distribuir suas músicas nas plataformas digitais. O sistema resolve esse gargalo ao centralizar a divulgação do estúdio móvel gratuito, permitindo que músicos e moradores conheçam o calendário de paradas por região, ouçam os lançamentos já gravados na comunidade e entendam como participar sem custos ou intermediários.

## Tecnologias escolhidas

| Escolha | Justificativa técnica |
|---|---|
| **HTML5, CSS3 e JavaScript (Vanilla)** | Aplicação leve, sem necessidade de etapa de build, com carregamento rápido em conexões móveis e controles nativos de acessibilidade (ajuste de fonte e alto contraste). |
| **Azure Static Web Apps** | Hospedagem em nuvem com entrega via CDN global, HTTPS automático e alta disponibilidade para aplicações web estáticas. |
| **GitHub + GitHub Actions** | Controle de versão e pipeline de integração e entrega contínua (CI/CD), publicando automaticamente no Azure a cada `push` na branch `main`. |

## Funcionalidades
- **Catálogo Interativo & Modal:** Filtragem de lançamentos por subgênero e visualização detalhada com foto, biografia e letra completa de cada artista.
- **Player de Áudio Persistente:** Reprodutor fixo na barra inferior com controle de progresso, volume, troca de faixas e reprodução contínua durante a navegação.
- **Roteiro Móvel & Participação:** Cronograma de atendimento por regiões (Zonas Oeste, Sul, Norte e Leste) e guia transparente de funcionamento.
- **Acessibilidade Web:** Barra dedicada para aumento/redução de fonte (`A+` / `A-`), modo de alto contraste, navegação por teclado e semântica ARIA.

## Estrutura do projeto
```text
├── index.html                          # Página principal e estrutura semântica
├── style.css                           # Estilização responsiva e temas de alto contraste
├── script.js                           # Lógica do catálogo, filtros, modal, player e acessibilidade
├── icone.ico / icone.png               # Identidade visual (favicon) da aplicação
├── audio/                              # Arquivos de áudio (.mp3) dos lançamentos
├── img/                                # Fotografias otimizadas dos artistas
├── docs/AZURE.md                       # Documentação de implantação no Azure
└── .github/workflows/                  # Pipeline automatizado do GitHub Actions

## Equipe

| Integrante | RA |
|---|---|
| Deivid Pinheiro da Silva Dantas | `3025200588` |
| João Victor Ribeiro Daguis | `3025107301` |
| Junior Jose da Silva | `3025202159` |
| Lucas Albergoni Mineiro | `3025107987` |