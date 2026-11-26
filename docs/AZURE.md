# Publicar o Estúdio Aberto no Azure (site + PHP + MySQL)

## Por que MySQL e não SQLite no Azure
O App Service para Linux guarda os arquivos persistentes em um disco de rede, e o SQLite não funciona bem
nele (travamento de arquivo). Fora dessa pasta o disco é apagado a cada reinício/deploy. Por isso, **no Azure
o banco é o Azure Database for MySQL**. No seu computador continua o SQLite (não precisa instalar MySQL):
o `db.php` escolhe sozinho — se existir a variável `DB_HOST` usa MySQL, senão usa SQLite.

## Como o sistema fica no ar
Um único App Service serve o site (index.html) e a pasta `api/` (PHP). Assim o formulário e o PHP ficam no mesmo
endereço e **não precisa de CORS nem de configuração extra no site**.

## Passo a passo
1. **Conta:** crie o Azure for Students (e-mail institucional, sem cartão) em azure.microsoft.com/free/students.
2. **App Service:** portal → Criar recurso → *Aplicativo Web*. Publicar: *Código* · Pilha: **PHP 8.4** ·
   SO: **Linux** · escolha região e plano (use o gratuito F1 se aparecer; senão B1). O nome define o endereço
   `https://NOME.azurewebsites.net`.
3. **Banco:** Criar recurso → *Azure Database for MySQL – Servidor Flexível* (camada Burstable B1ms).
   Crie usuário e senha do administrador e, depois, um banco chamado `estudio_aberto`.
   Em *Rede*, marque **"Permitir acesso público de qualquer serviço do Azure"** (para o App Service conectar).
   Confira no portal se o servidor está dentro da oferta gratuita antes de criar.
4. **Variáveis de ambiente** (App Service → *Configuração/Variáveis de ambiente* → Configurações do aplicativo):

   | Nome | Valor |
   |---|---|
   | `DB_HOST` | `SEU-SERVIDOR.mysql.database.azure.com` |
   | `DB_NAME` | `estudio_aberto` |
   | `DB_USER` | usuário do administrador |
   | `DB_PASS` | senha do administrador |
   | `ADMIN_HASH` | resultado de `php -r "echo password_hash('SUA_SENHA', PASSWORD_DEFAULT);"` |
   | `IP_SALT` | uma frase aleatória qualquer |

   Cole o `ADMIN_HASH` direto no portal (não por linha de comando, por causa dos símbolos `$`).
   Ative também **"Somente HTTPS"** nas configurações do aplicativo.
5. **Deploy pelo GitHub:**
   - O projeto já traz `.github/workflows/deploy-azure.yml`. Se o `deploy.yml` antigo (GitHub Pages) ainda existir no seu repositório, **apague-o**.
   - No App Service → *Visão geral* → **Obter perfil de publicação** e baixe o arquivo.
   - No GitHub: *Settings → Secrets and variables → Actions* e crie `AZURE_WEBAPP_PUBLISH_PROFILE`
     (conteúdo do arquivo) e `AZURE_WEBAPP_NAME` (o nome do app).
   - Se o perfil de publicação estiver indisponível, ative *Credenciais de publicação do SCM com autenticação
     básica* em Configuração → Configurações gerais, ou use o *Centro de Implantação* do próprio portal.
   - Faça `git push` na `main`: a aba *Actions* mostra o deploy.
6. **Testar:** abra `https://NOME.azurewebsites.net`, envie uma inscrição e depois acesse
   `https://NOME.azurewebsites.net/api/admin.php`.

## Se algo der errado
- **Erro 500:** App Service → *Fluxo de log* mostra o erro do PHP.
- **`could not find driver`:** a extensão `pdo_mysql` não está ativa nessa imagem (confira via SSH com `php -m`).
- **Erro de SSL/certificado:** defina `DB_SSL_CA` com valor vazio (conecta criptografado sem validar o certificado).
- **Timeout ao conectar no MySQL:** revise a regra de rede do servidor (passo 3).
- **A página abre mas o formulário dá erro:** confirme que a pasta `api/` está dentro do pacote publicado.

## Atenção
- No Azure for Students, quando o crédito de US$ 100 ou os 12 meses acabam, os recursos criados são desativados.
  Combine no grupo quem renova e deixe tudo no ar até a avaliação.
- Não existe `.htaccess` no Azure PHP (usa NGINX); por isso o banco ficou fora da pasta pública (está no MySQL).
- O painel `/api/admin.php` é protegido só por senha: use uma senha forte.
