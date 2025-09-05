import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Unique, OneToMany } from 'typeorm';
import { DocumentUploaded } from '../../document_uploaded/entities/document_uploaded.entity';

@Entity({ name: 'filesuploaded' })
@Unique(['technicalName'])
export class FileUploaded {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Nombre original subido por el usuario
  @Column({ type: 'varchar', length: 500 })
  originalName: string;

  // Nombre técnico único (ejemplo: hash, uuid+extensión)
  @Column({ type: 'varchar', length: 500 })
  technicalName: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'varchar', length: 2048 })
  publicUrl?: string;

  @Column({ type: 'varchar', length: 150 })
  mimetype?: string;
  
  @OneToMany(() => DocumentUploaded, (documentUploaded) => documentUploaded.fileUploaded)
  documentsUploaded: DocumentUploaded[];

}