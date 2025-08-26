import { v7 as uuid }  from 'uuid';
import * as path from "path";

export const fileNamer = ( req:Express.Request, file: Express.Multer.File, callback: Function ) => {

    if (!file) return callback( new Error('File is empty'), false );

    const extension = file.mimetype.split('/')[1];
    const fileName = `${ uuid() }.${ extension || '' }`;

    callback(null, fileName);
}

export const nombreNuevoUnico = ( originalname: string ) => {

    const extension = path.extname(originalname);
    const fileName = `${ uuid() }${ extension }`;

    // console.log({ originalname, fileName, extension });

    return fileName;
}
