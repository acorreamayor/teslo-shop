import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, Unique, JoinColumn } from 'typeorm';
import { KnowledgeBase } from '../../knowledge_base/entities/knowledge_base.entity';
import { FileUploaded } from '../../file_uploaded/entities/file_uploaded.entity';

@Entity('knowledge_bases_filesuploaded')
@Unique(['knowledgeBase', 'fileUploaded'])
export class KnowledgeBasesFilesuploaded {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ManyToOne(() => KnowledgeBase, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'knowledge_base_id' })
    knowledgeBase: KnowledgeBase;
  
    @ManyToOne(() => FileUploaded, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'file_uploaded_id' })
    fileUploaded: FileUploaded;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
