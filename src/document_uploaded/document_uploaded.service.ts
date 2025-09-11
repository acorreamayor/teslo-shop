import { Injectable, Logger  } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource  } from 'typeorm';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { OpenAIEmbeddings } from '@langchain/openai';
import pdfParse from 'pdf-parse';

import { DocumentUploaded } from './entities/document_uploaded.entity';
import { CreateDocumentUploadedDto } from './dto/create-document_uploaded.dto';
import { UpdateDocumentUploadedDto } from './dto/update-document_uploaded.dto';
import { FileUploaded } from '../file_uploaded/entities/file_uploaded.entity';
import { ShowError } from '../common/helpers';

@Injectable()
export class DocumentUploadedService {

  private readonly logger = new Logger(DocumentUploadedService.name);

  constructor(
    private readonly dataSource: DataSource, // injecta DataSource en el módulo
  ) {}
 
  
  /**
   * Añade los chunks del archivo a la tabla `documentsuploaded` usando embeddings Gemini.
   * - fileUploaded: entidad FileUploaded ya creada (contiene su id)
   * - file: Express.Multer.File cargado
   */  
  async addFiles(fileUploaded: FileUploaded, file: Express.Multer.File) {

    try {

      // 1) extraer texto del archivo (soporta text/* y PDF)
      let text = '';
      const mime = file.mimetype || '';

      const modelName = process.env.IA_EMBEDDING_MODEL || 'text-embedding-3-large';

      if (mime.startsWith('text/')) {
        text = file.buffer.toString('utf8');
      } else if (mime === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf')) {
        try {
          const pdf = await pdfParse(file.buffer);
          text = (pdf.text || '').trim();
        } catch (err) {
          this.logger.error('Error parseando PDF', err);
          throw new Error('No se pudo parsear el PDF');
        }
      } else {
        // fallback: intenta UTF-8 por si es .md, .csv, etc.
        try {
          text = file.buffer.toString('utf8');
        } catch (err) {
          throw new Error(`Tipo de archivo no soportado: ${mime}`);
        }
      }

      if (!text || text.length === 0) {
        throw new Error('El archivo no contiene texto extraíble');
      }

      // 2) split usando RecursiveCharacterTextSplitter (chunkSize:200, overlap:20)
      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 200,
        chunkOverlap: 20,
      });

      // createDocuments espera un array de "Document-like" objects con pageContent y metadata
      const texts2 = [text];
      const metadatas = [
        {
          fileId: fileUploaded.id,
          filename: file.originalname,
        },
      ];

      const docs = await splitter.createDocuments(texts2, metadatas);


      if (!docs || docs.length === 0) {
        throw new Error('No se generaron chunks del documento');
      }

      // 3) inicializar embeddings de Google Gemini (usa IA_API_KEY)
      // const embeddingsModel = new GoogleGenerativeAIEmbeddings({
      //   apiKey: process.env.IA_API_KEY,
      //   modelName: `models/${ process.env.IA_EMBEDDING_MODEL }}` // opcionalmente explícalo
      //   // si usas otro modelo, cámbialo aquí
      // });

      // 3) Utilizando openIA
      const embeddingsModel = new OpenAIEmbeddings({
        model: modelName,
        openAIApiKey: process.env.IA_API_KEY, // también funciona leyendo OPENAI_API_KEY desde env
      });      

      // 4) pedir embeddings en batch (langchain maneja batching internamente)
      const texts = docs.map((d) => d.pageContent);
      const vectors: number[][] = await embeddingsModel.embedDocuments(texts);

      if (!vectors || vectors.length !== docs.length) {
        throw new Error('La cantidad de embeddings recibidos no coincide con los chunks');
      }

      // 5) validar dimensión contra la columna vector de la tabla
      const expectedDim = parseInt(process.env.IA_EMBEDDING_DIM || '1536', 10); // configura IA_EMBEDDING_DIM si tu tabla no es 768
      const detectedDim = vectors[0]?.length ?? 0;
      if (expectedDim !== detectedDim) {
        // NO insertamos — mejor fallar con mensaje claro para que ajustes tabla/modelo
        throw new Error(
          `Dimensión de embeddings incompatible: la tabla espera ${expectedDim} pero el modelo devolvió ${detectedDim}. ` +
          `Ajusta la columna embedding o usa un modelo con dimensión ${expectedDim}.`,
        );
      }

      // 6) preparar inserción en batch usando DataSource (transacción)
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        const values: any[] = [];
        const placeholders: string[] = [];
        let idx = 1;

        for (let i = 0; i < docs.length; i++) {
          const doc = docs[i];
          const vector = vectors[i];
          const metadata = { ...(doc.metadata ?? {}), chunkIndex: i };

          // Guardamos el vector como string JSON para que empiece con '['
          const vectorLiteral = JSON.stringify(vector); // -> "[0.12, -0.03, ...]"

          // agregamos parámetros en orden: content, embedding, file_id, metadata, created_at opcional
          values.push(doc.pageContent);
          values.push(vectorLiteral);
          values.push(fileUploaded.id);
          values.push(JSON.stringify(metadata));

          // placeholder para postgres; pg acepta arrays para pgvector cuando pgvector-node/pg está presente
          //placeholders.push(`($${idx++}, $${idx++}, $${idx++}, $${idx++})`);
          placeholders.push(`($${idx++}, $${idx++}::vector, $${idx++}, $${idx++}::jsonb)`);
        }

        const sql = `
          INSERT INTO documentsuploaded (content, embedding, file_id, metadata)
          VALUES ${placeholders.join(', ')}
        `;

        await queryRunner.query(sql, values);

        await queryRunner.commitTransaction();
        this.logger.log(`Insertados ${docs.length} chunks en documentsuploaded (fileId=${fileUploaded.id})`);
      } catch (err) {
        await queryRunner.rollbackTransaction();
        this.logger.error('Error insertando embeddings en la DB', err);
        throw err;
      } finally {
        await queryRunner.release();
      }

      return;      

    } catch (err) {
      ShowError(err);
    }    
  }

  create(createDocumentUploadedDto: CreateDocumentUploadedDto) {
    return 'This action adds a new documentUploaded';
  }

  findAll() {
    return `This action returns all documentUploaded`;
  }

  findOne(id: number) {
    return `This action returns a #${id} documentUploaded`;
  }

  update(id: number, updateDocumentUploadedDto: UpdateDocumentUploadedDto) {
    return `This action updates a #${id} documentUploaded`;
  }

  remove(id: number) {
    return `This action removes a #${id} documentUploaded`;
  }

}
