CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE filesuploaded (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    original_name VARCHAR(500) NOT NULL,
    technical_name VARCHAR(500) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE documentsuploaded (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    embedding VECTOR(768), -- 👈 aquí sí usamos pgvector real
    file_id UUID NOT NULL REFERENCES filesuploaded(id) ON DELETE CASCADE,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT now()
);

ALTER TABLE filesuploaded ADD COLUMN publicUrl VARCHAR(2048);
ALTER TABLE filesuploaded ADD COLUMN mimetype VARCHAR(150);

ALTER TABLE filesuploaded ALTER COLUMN mimetype TYPE VARCHAR(150);

CREATE TABLE knowledge_bases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    visibility VARCHAR(50) DEFAULT 'private',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    "userId" UUID NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY ("userId") REFERENCES users(id)
);

CREATE INDEX idx_knowledge_bases_id_user ON knowledge_bases (id, "userId");
CREATE UNIQUE INDEX idx_knowledge_bases_user_title ON knowledge_bases ("userId", title);