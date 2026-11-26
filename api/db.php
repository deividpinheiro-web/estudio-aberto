<?php
declare(strict_types=1);

/**
 * Conexão com o banco.
 *  - Se existir a variável de ambiente DB_HOST  -> MySQL (Azure Database for MySQL).
 *  - Senão                                      -> SQLite local (api/data/estudio_aberto.db), ótimo para testar no seu PC.
 *
 * Variáveis do MySQL (App Settings no Azure): DB_HOST, DB_NAME, DB_USER, DB_PASS
 * Opcionais: DB_PORT (3306), DB_SSL_CA (padrão /etc/ssl/certs/ca-certificates.crt; use vazio para não validar o certificado)
 */
function db(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $host = getenv('DB_HOST');
    if ($host !== false && $host !== '') {
        $opcoes = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ];
        // O Azure MySQL exige conexão criptografada (TLS)
        $ca = getenv('DB_SSL_CA');
        if ($ca === false) {
            $ca = '/etc/ssl/certs/ca-certificates.crt';
        }
        if ($ca !== '' && is_readable($ca)) {
            $constante = defined('Pdo\Mysql::ATTR_SSL_CA') ? constant('Pdo\Mysql::ATTR_SSL_CA') : PDO::MYSQL_ATTR_SSL_CA;
            $opcoes[$constante] = $ca;
        }
        $dsn = sprintf(
            'mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4',
            $host,
            getenv('DB_PORT') ?: '3306',
            getenv('DB_NAME') ?: 'estudio_aberto'
        );
        $pdo = new PDO($dsn, (string) getenv('DB_USER'), (string) getenv('DB_PASS'), $opcoes);
        $pdo->exec("SET time_zone = '+00:00'");                       // horários sempre em UTC
        $pdo->exec((string) file_get_contents(__DIR__ . '/schema_mysql.sql')); // cria a tabela se não existir
        return $pdo;
    }

    // ---- SQLite (desenvolvimento local) ----
    $dir = __DIR__ . '/data';
    if (!is_dir($dir)) {
        mkdir($dir, 0750, true);
    }
    $path = $dir . '/estudio_aberto.db';
    $novo = !file_exists($path);

    $pdo = new PDO('sqlite:' . $path, null, null, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    $pdo->exec('PRAGMA foreign_keys = ON');
    if ($novo) {
        $pdo->exec((string) file_get_contents(__DIR__ . '/schema_sqlite.sql'));
    }
    return $pdo;
}

function e(?string $s): string
{
    return htmlspecialchars((string) $s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function csrf_token(): string
{
    if (empty($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf'];
}

function csrf_ok(?string $t): bool
{
    return is_string($t) && !empty($_SESSION['csrf']) && hash_equals($_SESSION['csrf'], $t);
}
