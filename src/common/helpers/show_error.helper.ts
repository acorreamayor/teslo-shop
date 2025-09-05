import { BadRequestException, InternalServerErrorException, Logger } from "@nestjs/common";

export const ShowError = ( error: any ) => {
        const logger = new Logger('FilesService');

        logger.error(error);

        if (error.detail)
            throw new BadRequestException(error.detail);

        if (error.where)
            throw new BadRequestException(error.where);

        throw new InternalServerErrorException(error);
    }