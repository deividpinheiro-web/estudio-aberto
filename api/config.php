<?php
/**
 * Configurações. Ordem de prioridade: config.local.php  >  variáveis de ambiente  >  padrão.
 *
 * NO AZURE: use as "Variáveis de ambiente" (App Settings) do App Service. Nada de senha no código/GitHub.
 *   ADMIN_HASH       hash da senha do painel (php -r "echo password_hash('SENHA', PASSWORD_DEFAULT);")
 *   IP_SALT          uma frase aleatória qualquer
 *   ALLOWED_ORIGINS  (opcional) endereços de outros sites autorizados a enviar, separados por vírgula
 *
 * LOCAL: pode criar config.local.php (ignorado pelo Git):
 *   <?php return ['admin_hash' => '...', 'ip_salt' => '...'];
 */
$env = static function (string $k, string $padrao = ''): string {
    $v = getenv($k);
    return ($v === false || $v === '') ? $padrao : (string) $v;
};

$padrao = [
    'admin_hash'      => $env('ADMIN_HASH'),
    'allowed_origins' => array_values(array_filter(array_map('trim', explode(',', $env('ALLOWED_ORIGINS'))))),
    'ip_salt'         => $env('IP_SALT', 'troque-este-sal'),
];

$local = __DIR__ . '/config.local.php';
return file_exists($local) ? array_merge($padrao, (array) require $local) : $padrao;
