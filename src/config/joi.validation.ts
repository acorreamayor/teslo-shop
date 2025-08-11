

import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
    MODE_ENV: Joi.string().default('dev'),

    DB_HOST: Joi.required(),
    DB_PORT: Joi.number().default(5432),
    DB_NAME: Joi.string().default('postgres'),
    DB_USERNAME: Joi.string().default('postgres'),
    DB_PASSWORD: Joi.required(),


    PORT: Joi.number().default(3000),
    DEFAULT_LIMIT: Joi.number().default(10)
});