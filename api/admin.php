<?php
declare(strict_types=1);
require __DIR__ . '/db.php';
session_start();

$cfg  = require __DIR__ . '/config.php';
$hash = (string) $cfg['admin_hash'];
$statuses = ['pendente' => 'Pendente', 'em_analise' => 'Em análise', 'aprovada' => 'Aprovada', 'recusada' => 'Recusada'];

if ($hash === '') {
    http_response_code(503);
    exit('Painel desativado: crie o config.local.php com o admin_hash (veja o README).');
}
if (isset($_GET['sair'])) {
    session_destroy();
    header('Location: admin.php');
    exit;
}

// ---------- Login ----------
if (empty($_SESSION['admin'])) {
    $erro = '';
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (csrf_ok($_POST['csrf'] ?? null) && password_verify((string) ($_POST['senha'] ?? ''), $hash)) {
            session_regenerate_id(true);
            $_SESSION['admin'] = true;
            header('Location: admin.php');
            exit;
        }
        sleep(1);
        $erro = 'Senha incorreta.';
    }
    ?>
<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Admin — Estúdio Aberto</title>
<style>body{background:#0b0b0b;color:#f2f2f2;font-family:system-ui,sans-serif;display:grid;place-items:center;min-height:100vh;margin:0}
form{background:#151515;border:1px solid #2a2a2a;border-radius:14px;padding:24px;display:grid;gap:12px;width:min(320px,90vw)}
input,button{padding:11px;border-radius:8px;border:1px solid #2a2a2a;font:inherit}input{background:#0f0f0f;color:#f2f2f2}
button{background:#FF5500;border:0;font-weight:700;cursor:pointer}.e{color:#ff8a7a}</style></head><body>
<form method="post"><strong>Painel de inscrições</strong>
<input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>">
<input type="password" name="senha" placeholder="Senha" required autofocus>
<?php if ($erro): ?><span class="e"><?= e($erro) ?></span><?php endif; ?>
<button>Entrar</button></form></body></html>
    <?php
    exit;
}

$pdo = db();

// ---------- Mudar status / observação ----------
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!csrf_ok($_POST['csrf'] ?? null)) {
        http_response_code(400);
        exit('Token inválido.');
    }
    $id   = (int) ($_POST['id'] ?? 0);
    $novo = (string) ($_POST['status'] ?? '');
    $obs  = mb_substr(trim((string) ($_POST['obs'] ?? '')), 0, 500);
    if ($id > 0 && isset($statuses[$novo])) {
        $pdo->prepare('UPDATE inscricoes SET status = ?, observacao_interna = ? WHERE id = ?')
            ->execute([$novo, $obs !== '' ? $obs : null, $id]);
    }
    $volta = isset($_GET['status']) && isset($statuses[$_GET['status']]) ? '?status=' . $_GET['status'] : '';
    header('Location: admin.php' . $volta);
    exit;
}

$filtro = isset($_GET['status']) && isset($statuses[$_GET['status']]) ? (string) $_GET['status'] : '';
if ($filtro !== '') {
    $st = $pdo->prepare('SELECT * FROM inscricoes WHERE status = ? ORDER BY criado_em DESC');
    $st->execute([$filtro]);
} else {
    $st = $pdo->query('SELECT * FROM inscricoes ORDER BY criado_em DESC');
}
$lista = $st->fetchAll();

// ---------- Exportar CSV (abre no Excel) ----------
if (isset($_GET['csv'])) {
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="inscricoes-estudio-aberto.csv"');
    $f = fopen('php://output', 'w');
    fwrite($f, "\xEF\xBB\xBF");
    fputcsv($f, ['Protocolo', 'Nome artístico', 'Bairro', 'Subgênero', 'WhatsApp', 'Link da demo', 'História', 'Status', 'Observação', 'Enviada em (UTC)'], ';');
    foreach ($lista as $r) {
        // evita que o Excel execute fórmulas digitadas pelo público
        $seguro = static fn(?string $s): string => preg_match('/^[=+\-@\t\r]/', (string) $s) ? "'" . $s : (string) $s;
        fputcsv($f, [$r['protocolo'], $seguro($r['nome_artistico']), $seguro($r['bairro']), $r['subgenero'], $r['whatsapp'],
            $seguro($r['link_demo']), $seguro($r['historia']), $r['status'], $seguro($r['observacao_interna']), $r['criado_em']], ';');
    }
    exit;
}

$contagem = $pdo->query('SELECT status, COUNT(*) n FROM inscricoes GROUP BY status')->fetchAll(PDO::FETCH_KEY_PAIR);
?>
<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Inscrições — Estúdio Aberto</title>
<style>
:root{--bg:#0b0b0b;--card:#151515;--line:#2a2a2a;--mut:#9a9a9a;--or:#FF5500;--gr:#00E676}
body{background:var(--bg);color:#f2f2f2;font-family:system-ui,sans-serif;margin:0;padding:24px;max-width:900px;margin-inline:auto}
h1{margin:0 0 16px}nav{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px}
nav a{padding:6px 14px;border:1px solid var(--line);border-radius:999px;color:#f2f2f2;text-decoration:none;font-size:.9rem}
nav a.on{background:var(--or);border-color:var(--or);color:#000;font-weight:700}
.card{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:16px;margin-bottom:12px;display:grid;gap:6px}
.top{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;align-items:center}
.mut{color:var(--mut);font-size:.88rem}a{color:var(--gr)}
.badge{font-size:.78rem;padding:3px 10px;border-radius:999px;border:1px solid var(--line)}
.badge.aprovada{border-color:var(--gr);color:var(--gr)}.badge.recusada{border-color:#ff6b5a;color:#ff6b5a}
form.s{display:flex;gap:6px;flex-wrap:wrap}select,button,input.o{background:#0f0f0f;color:#f2f2f2;border:1px solid var(--line);border-radius:8px;padding:6px 10px;font:inherit}
input.o{flex:1;min-width:160px}button{background:var(--or);color:#000;border:0;font-weight:700;cursor:pointer}
</style></head><body>
<div class="top"><h1>Inscrições de artistas</h1>
  <span><a href="?csv=1<?= $filtro ? '&status=' . e($filtro) : '' ?>">Baixar CSV</a> · <a href="?sair=1">Sair</a></span></div>
<nav>
  <a href="admin.php" class="<?= $filtro === '' ? 'on' : '' ?>">Todas (<?= array_sum($contagem) ?>)</a>
  <?php foreach ($statuses as $k => $nome): ?>
    <a href="?status=<?= e($k) ?>" class="<?= $filtro === $k ? 'on' : '' ?>"><?= e($nome) ?> (<?= (int) ($contagem[$k] ?? 0) ?>)</a>
  <?php endforeach; ?>
</nav>

<?php if (!$lista): ?><p class="mut">Nenhuma inscrição por aqui ainda.</p><?php endif; ?>

<?php foreach ($lista as $i): ?>
  <div class="card">
    <div class="top">
      <strong><?= e($i['protocolo']) ?> · <?= e($i['nome_artistico']) ?></strong>
      <span class="badge <?= e($i['status']) ?>"><?= e($statuses[$i['status']]) ?></span>
    </div>
    <div class="mut"><?= e($i['subgenero']) ?> · <?= e($i['bairro']) ?> · enviada em <?= e($i['criado_em']) ?> (UTC)</div>
    <div><a href="https://wa.me/55<?= e($i['whatsapp']) ?>" target="_blank" rel="noopener"><?= e($i['whatsapp']) ?></a> ·
      <a href="<?= e($i['link_demo']) ?>" target="_blank" rel="noopener noreferrer nofollow">Ouvir demo</a></div>
    <div><?= nl2br(e($i['historia'])) ?></div>
    <form class="s" method="post" action="admin.php<?= $filtro ? '?status=' . e($filtro) : '' ?>">
      <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>">
      <input type="hidden" name="id" value="<?= (int) $i['id'] ?>">
      <select name="status">
        <?php foreach ($statuses as $k => $nome): ?><option value="<?= e($k) ?>" <?= $i['status'] === $k ? 'selected' : '' ?>><?= e($nome) ?></option><?php endforeach; ?>
      </select>
      <input class="o" name="obs" maxlength="500" placeholder="Observação interna" value="<?= e($i['observacao_interna']) ?>">
      <button>Salvar</button>
    </form>
  </div>
<?php endforeach; ?>
</body></html>
