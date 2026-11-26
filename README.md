# Estúdio Aberto — Som da Quebrada

Sistema web do projeto cultural **Estúdio Aberto**: um estúdio móvel comunitário e gratuito que percorre bairros
periféricos para gravar, mixar e distribuir artistas independentes de trap e rap nacional.

O site apresenta o projeto, os artistas e o roteiro do estúdio, e **recebe as inscrições dos artistas**, que ficam
guardadas em um banco de dados e são avaliadas por um painel administrativo.

## Demanda real
[Explique em 2 ou 3 frases quem usa e o problema que isso resolve. Ex.: hoje as demos chegam por mensagens
soltas; agora ficam organizadas com protocolo, status e contato.]

## Tecnologias escolhidas

| Escolha | Por quê |
|---|---|
| **HTML, CSS e JavaScript** | Site leve, acessível (alto contraste e ajuste de fonte) e sem etapa de build. |
| **PHP 8.4** | Recebe o formulário de inscrição, valida no servidor e oferece o painel administrativo. |
| **MySQL (Azure Database for MySQL)** | Guarda as inscrições. No computador de cada pessoa do grupo usa SQLite, sem instalar nada. |
| **Azure App Service (Linux)** | Hospedagem em nuvem do site e da API. |
| **GitHub + GitHub Actions** | Versionamento e publicação automática no Azure a cada push na `main`. |

## Funcionalidades
- Catálogo de artistas com player de áudio.
- Formulário "Inscreva seu Som" com validação no navegador e no servidor, protocolo real (`#EA-2026-001`) e limite de envios por IP.
- Painel administrativo (`/api/admin.php`): filtro por status, observação interna, link da demo, WhatsApp e exportação em CSV.
- Acessibilidade: tamanho de fonte e alto contraste.

## Estrutura
```
index.html, style.css, script.js   site
audio/, img/                       trechos de áudio e fotos dos artistas
api/                               PHP: inscrever.php (formulário), admin.php (painel), db.php, config.php, schemas
docs/AZURE.md                      passo a passo de publicação no Azure
.github/workflows/deploy-azure.yml publicação automática
src/, public/, vite.config.js      experimento anterior em React (não faz parte da versão publicada)
```

## Como rodar no seu computador
Precisa de PHP 8+ com as extensões `mbstring`, `pdo_sqlite` e `sqlite3` ativas. Na pasta do projeto:

    php -S localhost:8000

- Site: http://localhost:8000/
- Painel: http://localhost:8000/api/admin.php

O banco local (`api/data/estudio_aberto.db`) é criado sozinho no primeiro envio.

Para ativar o painel, gere o hash da senha e crie `api/config.local.php` (ele não vai para o GitHub):

    php -r "echo password_hash(SUA_SENHA, PASSWORD_DEFAULT);"

    <?php return [admin_hash => COLE_O_HASH_AQUI, ip_salt => uma-frase-qualquer];

## Publicar
Veja [docs/AZURE.md](docs/AZURE.md).

## Endereço do sistema
https://[NOME-DO-APP].azurewebsites.net

## Equipe
Preencha com os nomes do grupo.

> Faixas de áudio e imagens: use apenas material que o grupo tem autorização para publicar.
