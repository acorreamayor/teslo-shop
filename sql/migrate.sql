
CREATE EXTENSION IF NOT EXISTS vector;

-- Crear la tabla users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    roles TEXT[] NOT NULL DEFAULT ARRAY['user']::TEXT[]
);

-- Índice único en email
CREATE UNIQUE INDEX "UQ_users_email" ON users (email);

-- Crear la tabla filesuploaded
CREATE TABLE filesuploaded (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    original_name VARCHAR(500) NOT NULL,
    technical_name VARCHAR(500) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);

-- Crear la tabla documentsuploaded
CREATE TABLE documentsuploaded (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    embedding VECTOR(1536), -- 👈 aquí sí usamos pgvector real
    file_id UUID NOT NULL REFERENCES filesuploaded(id) ON DELETE CASCADE,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX ON documentsuploaded (file_id);

-- 2) Índice vectorial (ejemplo: IVFFlat, cosine). Ajusta 'lists' según cardinalidad.
CREATE INDEX documentsuploaded_embedding_ivfflat
  ON documentsuploaded
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- Alternativa HNSW (mejor recall, mayor uso memoria/tiempo construcción)
CREATE INDEX documentsuploaded_embedding_hnsw
  ON documentsuploaded
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);


ALTER TABLE filesuploaded ADD COLUMN publicUrl VARCHAR(2048);
ALTER TABLE filesuploaded ADD COLUMN mimetype VARCHAR(150);

ALTER TABLE filesuploaded ALTER COLUMN mimetype TYPE VARCHAR(150);

-- Crear la tabla knowledge_bases
CREATE TABLE knowledge_bases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

CREATE TABLE knowledge_bases_filesuploaded (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    knowledge_base_id UUID NOT NULL,
    file_uploaded_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_knowledge_base 
        FOREIGN KEY (knowledge_base_id) 
        REFERENCES knowledge_bases(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_file_uploaded 
        FOREIGN KEY (file_uploaded_id) 
        REFERENCES filesuploaded(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_kb_file UNIQUE (knowledge_base_id, file_uploaded_id)
);