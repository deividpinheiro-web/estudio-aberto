# Estúdio Aberto — Som da Quebrada

Sistema web do projeto cultural **Estúdio Aberto**: um estúdio móvel comunitário e gratuito que percorre bairros
periféricos para gravar, mixar e distribuir artistas independentes de trap e rap nacional.

O site apresenta o projeto, os artistas com player de áudio, o roteiro do estúdio e como funciona a participação.

## Demanda real
[Explique em 2 ou 3 frases quem usa o site e o problema que ele resolve. Ex.: artistas e moradores das
periferias descobrem o estúdio, ouvem quem já gravou e entendem como participar.]

## Tecnologias escolhidas

| Escolha | Por quê |
|---|---|
| **HTML, CSS e JavaScript** | Site leve, acessível (alto contraste e ajuste de fonte) e sem etapa de build. |
| **Azure App Service (Linux)** | Hospedagem em nuvem do site. |
| **GitHub + GitHub Actions** | Versionamento e publicação automática no Azure a cada push na `main`. |

## Funcionalidades
- Catálogo de artistas com filtro por gênero, modal com a bio e player de áudio.
- Roteiro do estúdio móvel e explicação de como funciona a participação.
- Acessibilidade: tamanho de fonte e alto contraste.

## Estrutura
```
index.html, style.css, script.js   site
audio/, img/                       trechos de áudio e fotos dos artistas
docs/AZURE.md                      passo a passo de publicação no Azure
.github/workflows/deploy-azure.yml publicação automática
src/, public/, vite.config.js      experimento anterior em React (não faz parte da versão publicada)
```

## Como rodar no seu computador
Abra o `index.html` no navegador, ou use a extensão Live Server do VS Code. Pelo terminal, na pasta do projeto:

    python -m http.server 8080

e acesse http://localhost:8080/.

## Publicar
Veja [docs/AZURE.md](docs/AZURE.md).

## Endereço do sistema
https://[NOME-DO-APP].azurewebsites.net

## Equipe
Preencha com os nomes do grupo.

> Faixas de áudio e imagens: use apenas material que o grupo tem autorização para publicar.
