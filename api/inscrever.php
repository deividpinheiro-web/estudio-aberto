<?php
declare(strict_types=1);
/**
 * Recebe o formulário "Inscreva seu Som" (JSON ou form-data) e grava no banco.
 * Resposta: {"ok":true,"protocolo":"#EA-2026-001"} ou {"ok":false,"erros":{campo:msg}}
 */
require __DIR__ . '/db.php';
$cfg = require __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

// CORS: só necessário se o site e o PHP estiverem em endereços diferentes
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && in_array($origin, $cfg['allowed_origins'], true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
}
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

function responde(int $codigo, array $dados): void
{
    http_response_code($codigo);
    echo json_encode($dados, JSON_UNESCAPED_UNICODE);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    responde(405, ['ok' => false, 'erro' => 'Use POST.']);
}

$corpo = (string) file_get_contents('php://input');
$in = json_decode($corpo, true);
if (!is_array($in)) {
    $in = $_POST;
}

$txt = static function (string $k, int $max) use ($in): string {
    $v = isset($in[$k]) && is_scalar($in[$k]) ? trim((string) $in[$k]) : '';
    return mb_substr($v, 0, $max);
};

$nome     = $txt('nome', 80);
$bairro   = $txt('bairro', 80);
$genero   = $txt('genero', 20);
$demo     = $txt('demo', 500);
$zap      = preg_replace('/\D+/', '', $txt('zap', 20)) ?? '';
$historia = $txt('historia', 2000);

$generos = ['Trap', 'Plugg', 'Drill', 'Boombap', 'R&B', 'Funk'];
$erros = [];

if (mb_strlen($nome) < 2)     $erros['nome'] = 'Use ao menos 2 caracteres.';
if ($bairro === '')           $erros['bairro'] = 'Preencha este campo.';
if (!in_array($genero, $generos, true)) $erros['genero'] = 'Escolha um subgênero.';
if (!preg_match('~^https?://(www\.)?(soundcloud\.com|youtu\.be|youtube\.com|drive\.google\.com)/\S+$~i', $demo)) {
    $erros['demo'] = 'Use um link do SoundCloud, YouTube ou Google Drive.';
}
if (!preg_match('/^\d{2}9?\d{8}$/', $zap)) $erros['zap'] = 'Informe DDD e número, ex.: (11) 90000-0000.';
if (mb_strlen($historia) < 20) $erros['historia'] = 'Conte um pouco mais (mínimo de 20 caracteres).';

if ($erros) {
    responde(422, ['ok' => false, 'erros' => $erros]);
}

$pdo = db();
$ipHash = hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '') . $cfg['ip_salt']);

// Limite simples: no máximo 5 inscrições por hora por IP
$umaHoraAtras = gmdate('Y-m-d H:i:s', time() - 3600);
$st = $pdo->prepare('SELECT COUNT(*) FROM inscricoes WHERE ip_hash = ? AND criado_em > ?');
$st->execute([$ipHash, $umaHoraAtras]);
if ((int) $st->fetchColumn() >= 5) {
    responde(429, ['ok' => false, 'erro' => 'Muitas inscrições seguidas. Tente de novo mais tarde.']);
}

try {
    $pdo->beginTransaction();
    $pdo->prepare(
        'INSERT INTO inscricoes (nome_artistico, bairro, subgenero, link_demo, whatsapp, historia, ip_hash)
         VALUES (?,?,?,?,?,?,?)'
    )->execute([$nome, $bairro, $genero, $demo, $zap, $historia, $ipHash]);

    $id = (int) $pdo->lastInsertId();
    $protocolo = sprintf('#EA-%s-%03d', date('Y'), $id);
    $pdo->prepare('UPDATE inscricoes SET protocolo = ? WHERE id = ?')->execute([$protocolo, $id]);
    $pdo->commit();

    responde(201, ['ok' => true, 'protocolo' => $protocolo]);
} catch (PDOException $ex) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    if ($ex->getCode() === '23000') {
        responde(409, ['ok' => false, 'erro' => 'Essa inscrição já foi enviada (mesmo nome e WhatsApp).']);
    }
    error_log($ex->getMessage());
    responde(500, ['ok' => false, 'erro' => 'Não foi possível salvar agora. Tente novamente em instantes.']);
}
