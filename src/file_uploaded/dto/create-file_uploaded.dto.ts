import { IsString, MinLength } from "class-validator";

export class CreateFileUploadedDto {
    
    @IsString()
    @MinLength(1)
    originalName: string;

    @IsString()
    @MinLength(1)
    technicalName: string;

    @IsString()
    @MinLength(1)
    publicUrl: string;

    @IsString()
    mimetype?: string;

}
