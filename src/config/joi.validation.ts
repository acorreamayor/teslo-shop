

import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
    MODE_ENV: Joi.string().default('dev'),

    DB_HOST: Joi.required(),
    DB_PORT: Joi.number().default(5432),
    DB_NAME: Joi.string().default('postgres'),
    DB_USERNAME: Joi.string().default('postgres'),
    DB_PASSWORD: Joi.required(),


    PORT: Joi.number().default(3000),
    DEFAULT_LIMIT: Joi.number().default(10),

    JWT_SEED: Joi.string().required(),

    HOST_API: Joi.string().default('http://localhost:3000/api'),

    FILE_STORAGE_PROVIDER: Joi.string().default('NINGUNO'),

    B2_APPLICATION_KEY_ID: Joi.string(),
    B2_APPLICATION_KEY: Joi.string(),
    B2_BUCKET_NAME: Joi.string(),
    B2_DOWNLOAD_BASE_URL: Joi.string(),
    B2_BUCKET_URL: Joi.string()
    
});