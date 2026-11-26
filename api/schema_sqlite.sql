-- Estúdio Aberto — Som da Quebrada
-- Banco do formulário "Inscreva seu Som" (SQLite)
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS inscricoes (
    id                 INTEGER PRIMARY KEY AUTOINCREMENT,
    protocolo          TEXT UNIQUE,                 -- ex.: #EA-2026-001 (mostrado ao artista)
    nome_artistico     TEXT NOT NULL,               -- campo "nome"
    bairro             TEXT NOT NULL,               -- campo "bairro"
    subgenero          TEXT NOT NULL
                       CHECK (subgenero IN ('Trap','Plugg','Drill','Boombap','R&B','Funk')),
    link_demo          TEXT NOT NULL,               -- campo "demo"
    whatsapp           TEXT NOT NULL,               -- só dígitos (DDD + número)
    historia           TEXT NOT NULL,               -- campo "historia" (release)
    status             TEXT NOT NULL DEFAULT 'pendente'
                       CHECK (status IN ('pendente','em_analise','aprovada','recusada')),
    observacao_interna TEXT,
    ip_hash            TEXT,                        -- só para limitar envios em massa
    criado_em          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Mesmo artista + mesmo WhatsApp não se inscreve duas vezes
CREATE UNIQUE INDEX IF NOT EXISTS ux_inscricoes_nome_zap
    ON inscricoes (lower(nome_artistico), whatsapp);
CREATE INDEX IF NOT EXISTS ix_inscricoes_status ON inscricoes (status);
CREATE INDEX IF NOT EXISTS ix_inscricoes_ip ON inscricoes (ip_hash, criado_em);

CREATE TRIGGER IF NOT EXISTS trg_inscricoes_atualizado
AFTER UPDATE ON inscricoes
FOR EACH ROW
BEGIN
    UPDATE inscricoes SET atualizado_em = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;
