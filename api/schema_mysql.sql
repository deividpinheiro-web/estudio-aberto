-- Estúdio Aberto — Som da Quebrada
-- Banco do formulário "Inscreva seu Som" (MySQL — Azure Database for MySQL)
-- Pode ser executado várias vezes sem problema (IF NOT EXISTS).
CREATE TABLE IF NOT EXISTS inscricoes (
    id                 INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    protocolo          VARCHAR(20) NULL UNIQUE,              -- ex.: #EA-2026-001
    nome_artistico     VARCHAR(80)  NOT NULL,
    bairro             VARCHAR(80)  NOT NULL,
    subgenero          ENUM('Trap','Plugg','Drill','Boombap','R&B','Funk') NOT NULL,
    link_demo          VARCHAR(500) NOT NULL,
    whatsapp           VARCHAR(11)  NOT NULL,                -- só dígitos (DDD + número)
    historia           TEXT         NOT NULL,
    status             ENUM('pendente','em_analise','aprovada','recusada') NOT NULL DEFAULT 'pendente',
    observacao_interna VARCHAR(500) NULL,
    ip_hash            CHAR(64)     NULL,                    -- só para limitar envios em massa
    criado_em          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY ux_inscricoes_nome_zap (nome_artistico, whatsapp),
    KEY ix_inscricoes_status (status),
    KEY ix_inscricoes_ip (ip_hash, criado_em)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
