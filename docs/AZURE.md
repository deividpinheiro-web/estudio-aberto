# Publicar o Estúdio Aberto no Azure

O site é só HTML, CSS e JavaScript (sem banco de dados e sem servidor próprio). O workflow
`.github/workflows/deploy-azure.yml` envia `index.html`, `script.js`, `style.css`, `icone.ico`, `audio/` e `img/`
para um Azure App Service a cada push na `main`.

## Passo a passo
1. **Conta:** crie o Azure for Students (e-mail institucional, sem cartão) em azure.microsoft.com/free/students.
2. **App Service:** portal → Criar recurso → *Aplicativo Web*. Publicar: *Código* · SO: **Linux** · Pilha:
   **PHP 8.4** (o site não usa PHP; essa pilha serve arquivos estáticos) · escolha região e plano
   (use o gratuito F1 se aparecer; senão B1). O nome define o endereço `https://NOME.azurewebsites.net`.
   Ative também **"Somente HTTPS"** nas configurações do aplicativo.
3. **Deploy pelo GitHub:**
   - No App Service → *Visão geral* → **Obter perfil de publicação** e baixe o arquivo.
   - No GitHub: *Settings → Secrets and variables → Actions* e crie `AZURE_WEBAPP_PUBLISH_PROFILE`
     (conteúdo do arquivo) e `AZURE_WEBAPP_NAME` (o nome do app).
   - Se o perfil de publicação estiver indisponível, ative *Credenciais de publicação do SCM com autenticação
     básica* em Configuração → Configurações gerais, ou use o *Centro de Implantação* do próprio portal.
   - Faça `git push` na `main`: a aba *Actions* mostra o deploy.
4. **Testar:** abra `https://NOME.azurewebsites.net`.

## Se algo der errado
- **Página em branco ou 404:** confirme na aba *Actions* que o deploy terminou e, no *Fluxo de log* do App Service, veja o erro.
- **Faltam áudios ou fotos:** confira se as pastas `audio/` e `img/` estão no repositório.

## Alternativa
O **Azure Static Web Apps** (plano gratuito) é feito para sites estáticos e se conecta ao GitHub pelo próprio portal.
Se o grupo preferir, dá para trocar o workflow.

## Atenção
- No Azure for Students, quando o crédito de US$ 100 ou os 12 meses acabam, os recursos criados são desativados.
  Combine no grupo quem renova e deixe tudo no ar até a avaliação.
