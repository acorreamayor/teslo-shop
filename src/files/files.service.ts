import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FilesService {

    host_api: string;

    file_storage_provider: string;
    b2_application_key_id: string;
    b2_application_key: string;
    b2_bucket_name: string;
    b2_download_base_url:string;
    b2_bucket_url: string;


    constructor(
        private readonly configService: ConfigService
    ){
        this.host_api = configService.get<string>('host_api') || 'http://localhost:3000/api';

        this.file_storage_provider = configService.get<string>('file_storage_provider') || 'NINGUNO';
        this.b2_application_key_id = configService.get<string>('b2_application_key_id') || '';
        this.b2_application_key = configService.get<string>('b2_application_key') || '';
        this.b2_bucket_name = configService.get<string>('b2_bucket_name') || '';
        this.b2_download_base_url = configService.get<string>('b2_download_base_url') || '';
        this.b2_bucket_url = configService.get<string>('b2_bucket_url') || '';
    }

    gerStaticImage(imageName: string) {
        const path = join(__dirname, '../../static/uploads', imageName);

        if ( !existsSync(path) ) {
            throw new BadRequestException(`No product faoud with image ${ imageName }`)
        } else {
            return path;
        }
    }

}
