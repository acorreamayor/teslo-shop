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
