import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FilesService {

    host_api: string;

    constructor(
        private readonly configService: ConfigService
    ){
        this.host_api = configService.get<string>('host_api') || 'http://localhost:3000/api';
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
