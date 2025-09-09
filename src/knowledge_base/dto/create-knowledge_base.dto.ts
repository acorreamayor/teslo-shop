import { IsString, IsOptional, IsIn, Length } from 'class-validator';

export class CreateKnowledgeBaseDto {

    @IsString()
    @Length(3, 200)
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsIn(['public', 'private', 'restricted'])
    visibility?: string = 'private';
    
}
