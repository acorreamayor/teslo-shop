import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { existsSync } from 'fs';
import { join } from 'path';
import B2 = require('backblaze-b2');
import { nombreNuevoUnico } from './helpers';
import { FileUploadedService } from '../file_uploaded/file_uploaded.service';
import axios from 'axios';
import { Response } from 'express';
import { ShowError } from '../common/helpers';

@Injectable()
export class FilesService {

    host_api: string;

    file_storage_provider: string;
    b2_application_key_id: string;
    b2_application_key: string;
    b2_bucket_name: string;
    b2_download_base_url:string;
    b2_bucket_url: string;

    private b2: B2;
    private readonly logger = new Logger('FilesService');

    constructor(
        private readonly configService: ConfigService,
        private readonly fileUploadedService: FileUploadedService

    ){
        this.host_api = configService.get<string>('host_api') || 'http://localhost:3000/api';

        this.file_storage_provider = configService.get<string>('file_storage_provider') || 'NINGUNO';
        this.b2_application_key_id = configService.get<string>('b2_application_key_id') || '';
        this.b2_application_key = configService.get<string>('b2_application_key') || '';
        this.b2_bucket_name = configService.get<string>('b2_bucket_name') || '';
        this.b2_download_base_url = configService.get<string>('b2_download_base_url') || '';
        this.b2_bucket_url = configService.get<string>('b2_bucket_url') || '';

        this.b2 = new B2({
            applicationKeyId: this.b2_application_key_id, // accountId
            applicationKey: this.b2_application_key,     // applicationKey
        });    

    }

    gerStaticImage(imageName: string) {
    const path = join(__dirname, '../../static/uploads', imageName);

        if ( !existsSync(path) ) {
            throw new BadRequestException(`No product faoud with image ${ imageName }`)
        } else {
            return path;
        }
    }

    // Carga un archivo a un proveedor externo y registra en la base de datos
    async upload(file: Express.Multer.File) {

        try {

            if( this.file_storage_provider === 'NINGUNO' ) {
                throw new BadRequestException('No ha configurado un proveedor de carga de archivos.');
            }
    
            if (!file) {
                throw new BadRequestException('Make sure that the file is valid');
            }
    
            // 1️⃣ Autenticar con Backblaze
            await this.b2.authorize();
    
            // 2️⃣ Obtener la URL de subida del bucket
            const bucketName = this.b2_bucket_name;
            const { data: bucketData } = await this.b2.getBucket({ bucketName });
            const bucketId = bucketData.buckets[0].bucketId;
    
            const { data: uploadData } = await this.b2.getUploadUrl({ bucketId });
    
            // 3️⃣ Generar nombre único y subir el archivo desde buffer
            const newFileName = nombreNuevoUnico(file.originalname);
    
            await this.b2.uploadFile({
                uploadUrl: uploadData.uploadUrl,
                uploadAuthToken: uploadData.authorizationToken,
                fileName: newFileName,
                data: file.buffer, // ⬅ Usamos el buffer directamente
                mime: file.mimetype,
            });
    
            // 4️⃣ Generar URL pública
            const publicUrl = `${ this.b2_bucket_url }/${ newFileName }`;
    
            // Guardo en la tabla de archivos cargados
            const fileUploaded = await this.fileUploadedService.create({
                originalName: file.originalname,
                technicalName: newFileName,
                publicUrl: publicUrl,
                mimetype: file.mimetype
            });
    
            return fileUploaded;
        
        } catch(error) {
            ShowError(error);
        }
    }

    async getArchivo( res: Response, id: string, validateImage?: string ) {
    
        try {
    
            const fileUploaded = await this.fileUploadedService.findOne(id);
            const mimetype = fileUploaded.mimetype || '';

            // Valida que sea una imagen
            if (validateImage === 'true') {

                if (!mimetype.startsWith('image/')) {
                    throw new BadRequestException('El archivo debe ser una imagen');
                }

            }

            if( this.file_storage_provider === 'NINGUNO' ) {
            throw new BadRequestException('No ha configurado un proveedor de carga de archivos.');
            }
      
            const nombreArchivo = fileUploaded.technicalName;
      
            if (!nombreArchivo) {
                throw new BadRequestException('Image name is required');
            }
      
            // 1️⃣ Autorizar
            await this.b2.authorize();
        
            // 2️⃣ Obtener bucketId
            const bucketName = this.b2_bucket_name;
            const { data: bucketData } = await this.b2.getBucket({ bucketName });
            const bucketId = bucketData.buckets[0].bucketId;
        
            // 3️⃣ Generar autorización de descarga para ese archivo
            const { data: authData } = await this.b2.getDownloadAuthorization({
                bucketId,
                fileNamePrefix: nombreArchivo,
                validDurationInSeconds: 60 // válido por 1 minuto
            });
      
      
            // 4️⃣ Construir URL temporal
            const downloadUrl = `${ this.b2_download_base_url }/file/${bucketName}/${nombreArchivo}?Authorization=${authData.authorizationToken}`;
      
            // 5️⃣ Descargar el archivo y enviarlo como stream
            const fileStream = await axios.get(downloadUrl, { responseType: 'stream' });

            res.setHeader('Content-Type', fileStream.headers['content-type'] || 'application/octet-stream');
            res.setHeader('Content-Disposition', `inline; filename="${nombreArchivo}"`);
            fileStream.data.pipe(res);

        } catch(error) {

            ShowError(error);

        }
    
    }
  
}
