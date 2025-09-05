import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
  } from 'typeorm';
import { FileUploaded } from '../../file_uploaded/entities/file_uploaded.entity';


@Entity({ name: 'documentsuploaded' })
export class DocumentUploaded {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  content: string;

  // Usamos pgvector directamente
  @Column({ type: 'jsonb', nullable: true })
  embedding?: number[];

  @Index()
  @Column('uuid')
  fileId: string;

  @ManyToOne(() => FileUploaded, (fileUploaded) => fileUploaded.documentsUploaded, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fileId' })
  fileUploaded: FileUploaded;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
}
