

export const EnvConfiguration = () => ({
    enviroment: process.env.MODE_ENV,

    dbhost: process.env.DB_HOST,
    dbport: process.env.DB_PORT,
    dbdatabase: process.env.DB_NAME,
    dbusername: process.env.DB_USERNAME,

    port: process.env.PORT,
    default_limit: +(process.env.DEFAULT_LIMIT || 10),

    host_api: process.env.HOST_API,

    jwt_seed: process.env.JWT_SEED,
    
    file_storage_provider: process.env.FILE_STORAGE_PROVIDER || 'NINGUNO',

    b2_application_key_id: process.env.B2_APPLICATION_KEY_ID,
    b2_application_key: process.env.B2_APPLICATION_KEY,
    b2_bucket_name: process.env.B2_BUCKET_NAME,
    b2_download_base_url: process.env.B2_DOWNLOAD_BASE_URL,
    b2_bucket_url: process.env.B2_BUCKET_URL

});

