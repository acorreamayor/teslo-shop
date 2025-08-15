import { v7 as uuid }  from 'uuid';


export const fileNamer = ( req:Express.Request, file: Express.Multer.File, callback: Function ) => {

    if (!file) return callback( new Error('File is empty'), false );

    const extension = file.mimetype.split('/')[1];
    const fileName = `${ uuid() }.${ extension || '' }`;

    callback(null, fileName);
}

export const nombreNuevoUnico = ( mimetype: string ) => {

    const extension = mimetype.split('/')[1];
    const fileName = `${ uuid() }.${ extension || '' }`;

    return fileName;
}
